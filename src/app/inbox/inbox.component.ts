import { Component, OnInit } from '@angular/core';
import { LocalStorageAccountService } from '../services/helpers/local-storage-account/local-storage-account.service';
import { MailchainService } from '../services/mailchain/mailchain.service';
import { MessagesService } from '../services/mailchain/messages/messages.service';
import { InboundMail } from '../models/inbound-mail';
import { LocalStorageServerService } from '../services/helpers/local-storage-server/local-storage-server.service';
import { LocalStorageProtocolService } from '../services/helpers/local-storage-protocol/local-storage-protocol.service';
import { AddressesService } from '../services/mailchain/addresses/addresses.service';
import { NameserviceService } from '../services/mailchain/nameservice/nameservice.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  public fromAddresses: any = {};
  public fromAddressesKeys: Array<any> = [];
  public networks: Array<any> = [];
  public currentWebProtocols: Array<any> = [];
  public inboxMessages: Array<any> = [];
  public messagesLoaded: boolean = false;
  public fetchMessagesDisabled: boolean = false;
  public fetchMessagesText: String

  public inboxPartial: string = 'messages'

  public currentAccount: string;
  public currentNetwork: string;
  public currentProtocol: string = "ethereum"
  public currentMail: any;
  public currentMessage: any;

  public currentWebProtocol: string;
  public currentHost: string;
  public currentPort: string;
  public serverSettings: any = {};

  public accountIdenticons: any = {};
  public accountNameRecord: any = {};

  constructor(
    private localStorageAccountService: LocalStorageAccountService,
    private localStorageServerService: LocalStorageServerService,
    private LocalStorageProtocolService: LocalStorageProtocolService,
    private addressesService: AddressesService,
    private mailchainService: MailchainService,
    private messagesService: MessagesService,
    private nameserviceService: NameserviceService,
  ) { }

  /**
   * Changes the view to 'compose' a message.
   * @param message (optional) message to reply to (>> 'currentMessage')
   */
  composeMessage(message?): void {
    this.currentMessage = void 0;
    if (message != undefined) {
      this.currentMessage = message;
    }
    this.changeView('compose');
  }

  /**
   * Changes the messageCount for each inbox
   * @param array [address: string,count: number]
   */
  onInboxCounter(array) {
    // TODO: fix encoding
    var address: string = this.addressesService.handleAddressFormattingByProtocol(array[0], this.currentProtocol)
    var count: number = array[1]
    this.fromAddresses[address]["messageCount"]["inbox"] = count
  }

  /**
   * Changes the view to message and shows the mail
   * @param mail the message to show
   */
  onOpenMessage(mail: any): void {
    this.currentMessage = mail;
    this.changeView('message');
  }

  /**
   * Changes the inboxPartial component in view. If an invalid inboxPartial is passed, it will throw a warning on the console and not change the partial.
   * @param inboxPartial String required: `messages` | `message` | `compose`
   */
  changeView(inboxPartial: string): void {
    if (["messages", "message", "compose"].includes(inboxPartial)) {
      this.inboxPartial = inboxPartial
    } else {
      console.error('Error: Invalid partial')
    }
  }

  /**
   * Changes the local currentAccount.
   * @param address is the account/address to set
   */
  changeAccount(address) {
    if (this.inboxPartial != 'messages') {
      this.changeView('messages');
    }
    this.currentAccount = address
    this.localStorageAccountService.setCurrentAccount(this.currentAccount)
  }

  /**
   * Retrieve the current server settings for the inbox
   */
  public getServerSettings() {
    this.currentWebProtocol = this.localStorageServerService.getCurrentWebProtocol()
    this.currentHost = this.localStorageServerService.getCurrentHost()
    this.currentPort = this.localStorageServerService.getCurrentPort()
  }

  /**
   * Returns true or false for whether the address is the active currentAccount
   * @param address the address to query
   */
  public addressIsActive(address) {
    return address == this.currentAccount
  }

  /**
   * Creates a list of 'from' addresses (i.e. sender addresses) formatted as a hash with the following fields:
   * label: the address
   * value: the address
   * messageCount: a hash containing folder values of message count:
   *   inbox: default 0
   */
  async setFromAddressList() {
    this.fromAddressesKeys = await this.addressesService.getAddresses(this.currentProtocol, this.currentNetwork);

    this.fromAddressesKeys.forEach(address => {
      this.fromAddresses[address] = {
        label: address,
        value: address,
        messageCount: {
          inbox: 0,
        }
      }
    });
  }

  /**
   * Fetch account identicons for all fromAddresses and set the address value in accountIdenticons.
   */
  setAccountIdenticons() {
    this.fromAddressesKeys.forEach(address => {
      this.accountIdenticons[address] = this.mailchainService.generateIdenticon(this.currentProtocol, address)
    });
  }

  /**
   * Lookup name records for addresses
   */
  setAccountNameRecords() {
    this.fromAddressesKeys.forEach(address => {
      this.nameserviceService.resolveAddress(this.currentProtocol, this.currentNetwork, address).subscribe(res => {
        if (res['ok']) {
          this.accountNameRecord[address] = res['body']['name']
        }
      })
    });
  }

  async ngOnInit(): Promise<void> {
    this.setFetchingMessagesState(true)

    try {
      this.currentAccount = await this.localStorageAccountService.getCurrentAccount()
      this.currentNetwork = this.localStorageServerService.getCurrentNetwork()
      this.currentProtocol = await this.LocalStorageProtocolService.getCurrentProtocol()
      this.getServerSettings()
    } catch (error) {
      this.getServerSettings()
      // @TODO add error handling for failure to reach server
      console.warn("error: " + error);
      console.warn("error: it doesn't look like your application is running. Please check your settings.");
    }

    await this.setFromAddressList()
    this.getMails()
    this.setAccountIdenticons()
    this.setAccountNameRecords()
  }


  /**
   * Fetch mails from the server
   * @param quietMode (default: false) when true, messages are quietly loaded
   */
  public getMails(quietMode: boolean = false) {

    this.setFetchingMessagesState(true, quietMode)

    let fetchCount = this.fromAddressesKeys.length // we count this down for each req

    this.fromAddressesKeys.forEach(address => {
      var self = this
      this.messagesService.getMessages(address, this.currentProtocol, this.currentNetwork).subscribe(function (res) {

        self.processUnreadMessagesInboxCounter(address, res["body"]["messages"])
        self.processInboxMessages(res["body"]["messages"])

        --fetchCount // decrement fetchCount

        if (fetchCount == 0) { // all get requests should be complete
          self.setFetchingMessagesState(false)
        }
      })

    });

  };

  /**
   * processUnreadMessagesInboxCounter: counts the number of unread messages for an address and sets the inbox counter.
   * @param address: (string) the address of the messages
   * @param messages: array of messages
   */
  public processUnreadMessagesInboxCounter(address, messages) {
    let unreadMsgs = this.mailchainService.filterMessages(
      this.currentProtocol,
      messages,
      { status: "ok", readState: false }
    )
    let uniqUnreadMsgs = this.mailchainService.dedupeMessagesByIds(unreadMsgs)

    this.onInboxCounter([address, uniqUnreadMsgs.length])

  }

  /**
   * processInboxMessages: adds messages with status: "ok" to the InboxMessages as an InboundMail object
   * @param messages
   */
  public processInboxMessages(messages: Array<any>) {
    let validMessages = this.mailchainService.filterMessages(
      this.currentProtocol,
      messages,
      { status: "ok" }
    )
    validMessages.forEach(msg => this.addMailToInboxMessages(msg));
  }


  /**
   * setFetchingMessagesState
   * @param state: boolean;
   *  true when fetching messages
   *  false when NOT fetching message
   * @param quietMode: (optional) when true, messages are quietly loaded
   */
  public setFetchingMessagesState(state: boolean, quietMode?: boolean) {
    this.fetchMessagesDisabled = state;
    if (state) {
      this.setFetchMessagesText(1)
      if (!quietMode) {
        this.inboxMessages = []
        this.messagesLoaded = false;
      }
    } else {
      this.setFetchMessagesText(0)
      this.messagesLoaded = true;
    }
  }

  /**
   * Set the fetchMessagesText variable
   * @param statusCode:
   *    0 = Default state ('Check Messages')
   *    1 = Loading ('Loading...')
   */
  private setFetchMessagesText(statusCode: number) {
    switch (statusCode) {
      case 0:
        this.fetchMessagesText = "Check Messages"
        break
      case 1:
        this.fetchMessagesText = "Loading..."
        break
    }

  }

  /**
   * Adds a message to inboxMessages as an InboundMessage object
   * @param decryptedMsg
   */
  addMailToInboxMessages(decryptedMsg) {
    decryptedMsg.senderIdenticon = this.mailchainService.generateIdenticon(this.currentProtocol, decryptedMsg.headers.from)
    var msg = {
      ...new InboundMail,
      ...decryptedMsg
    }
    this.inboxMessages.push(msg)
  }

}
