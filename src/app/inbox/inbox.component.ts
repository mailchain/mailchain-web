import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/helpers/local-storage/local-storage.service';
import { PublicKeyService } from '../services/mailchain/public-key/public-key.service';
import { MailchainService } from '../services/mailchain/mailchain.service';
import { MessagesService } from '../services/mailchain/messages/messages.service';
import { InboundMail } from '../models/inbound-mail';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  public fromAddresses: any = {};
  public fromAddressesKeys: Array<any> = [];
  public networks: Array<any> = [];
  public inboxMessages: Array<any> = [];
  public messagesLoaded: boolean = false;
  public fetchMessagesDisabled: boolean = false;
  public fetchMessagesText: String = "Check Messages";
  
  public inboxPartial: string = 'messages'

  public currentAccount: string;
  public currentNetwork: string;
  public currentMail: any;
  public currentMessage: any;
  
  public accountIdenticons: any = {};


  constructor(
    private localStorageService: LocalStorageService,
    private publicKeyService: PublicKeyService,
    private mailchainService: MailchainService,
    private messagesService: MessagesService,
  ) {}


  composeMessage(message?): void {
    this.currentMessage = void 0;
    if (message != undefined) {
      this.currentMessage = message;
    }
    this.changeView('compose');
  }

  /**
   * [address: string,count: number]
   */
  onInboxCounter(array) {
    var address: string = array[0] 
    var count: number = array[1]
    this.fromAddresses[address.toLowerCase()]["messageCount"]["inbox"] = count
  }

  onOpenMessage(mail: any): void {
    this.currentMessage = mail;
    this.changeView('message');
  }

  changeView(inboxPartial: string): void {
    this.inboxPartial = inboxPartial
  }

  /**
   * Changes active folder in list
   */
  changeActiveItem(elementId): void {
    document.querySelectorAll('.nav-item').forEach(element => {
      element.classList.remove("active")
    })
    document.getElementById(elementId).classList.add("active");
  }

  /**
   * Changes the local current Account and fetches mails for that account.
   */
  changeAccount(address){    
    if (this.inboxPartial != 'messages') {
      this.changeView('messages');
    }
    this.currentAccount = address
    this.localStorageService.setCurrentAccount(this.currentAccount)
  }

  /**
   * Changes the network and fetches mails for that network.
   */
  changeNetwork(){    
    this.changeView('messages')
    this.localStorageService.setCurrentNetwork(this.currentNetwork)
    this.getMails()
  }

  public addressIsActive(address){
    return address == this.currentAccount
  }


  async setFromAddressList(){
    this.fromAddressesKeys = await this.publicKeyService.getPublicSenderAddresses();
    
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
   * Set the list of networks in the dropdown
   */
  setNetworkList(){
    var networks = this.mailchainService.getPublicNetworks();
    networks.forEach(network => {
      this.networks.push({
        label: network,
        value: network,
      })
    });
  }

  getIdenticon(address){
    this.mailchainService.generateIdenticon(address)
  }

  /**
   * Fetch account identicons for all fromAddresses and set the address value in accountIdenticons.
   */
  setAccountIdenticons() {
    this.fromAddressesKeys.forEach(address => {
      this.accountIdenticons[address] = this.mailchainService.generateIdenticon(address)
    });    
  }

  async ngOnInit(): Promise<void> {
    this.currentAccount = await this.localStorageService.getCurrentAccount()
    this.currentNetwork = this.localStorageService.getCurrentNetwork()
    
    await this.setFromAddressList()
    this.getMails()
    this.setNetworkList()
    this.setAccountIdenticons()
  }


  /**
   * Fetch mails from the server
   */
  public getMails(quiet?: boolean){
    if (!quiet) {
      this.inboxMessages = []
      this.messagesLoaded = false;
    }
    this.fetchMessagesText = "Loading...";
    this.fetchMessagesDisabled = true;
    
    let fetchCount = this.fromAddressesKeys.length // we count this down for each req
    
    this.fromAddressesKeys.forEach(address => {
      var self = this
      this.messagesService.getMessages(address, this.currentNetwork).subscribe(function(res){
        
        let unreadMsgs = res["messages"].filter(msg => msg.status === "ok" && !msg.read);
        let uniqUnreadMsgs = self.mailchainService.dedupeMessagesByIds(unreadMsgs)

        self.onInboxCounter([address, uniqUnreadMsgs.length])
        res["messages"].forEach(decryptedData => {
          // only parse valid messages
          if (decryptedData.status == "ok") {
            self.addMailToInboxMessages(decryptedData);
          }
        });
        --fetchCount
        
        if (fetchCount == 0 ) { // all get reqs should be complete
          self.messagesLoaded = true;
          self.fetchMessagesText = "Check Messages";
          self.fetchMessagesDisabled = false;  
        }
      })
      
    });
    
  };

    /**
   * 
   * @param decryptedMsg 
   */
  addMailToInboxMessages(decryptedMsg){  
    decryptedMsg.senderIdenticon = this.mailchainService.generateIdenticon(decryptedMsg.headers.from)
    var msg = {
      ...new InboundMail,
      ...decryptedMsg
    }
    this.inboxMessages.push(msg)
  }

}
