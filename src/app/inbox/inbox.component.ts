import { Component, OnInit } from '@angular/core';
import { LocalStorageAccountService } from '../services/helpers/local-storage-account/local-storage-account.service';
import { MailchainService } from '../services/mailchain/mailchain.service';
import { MessagesService } from '../services/mailchain/messages/messages.service';
import { InboundMail } from '../models/inbound-mail';
import { NgForm } from '@angular/forms';
import { LocalStorageServerService } from '../services/helpers/local-storage-server/local-storage-server.service';
import { ActivatedRoute } from '@angular/router';
import { AddressesService } from '../services/mailchain/addresses/addresses.service';
import { ProtocolsService } from '../services/mailchain/protocols/protocols.service';
import { throwError } from 'rxjs';
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
    private addressesService: AddressesService,
    private protocolsService: ProtocolsService,
    private mailchainService: MailchainService,
    private messagesService: MessagesService,
    private activatedRoute: ActivatedRoute,
    private nameserviceService: NameserviceService,
  ) {}

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
    var address: string = array[0] 
    var count: number = array[1]
    this.fromAddresses[address.toLowerCase()]["messageCount"]["inbox"] = count
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
    if ( [ "messages", "message", "compose"].includes(inboxPartial) ) {
      this.inboxPartial = inboxPartial
    } else {
      console.error('Error: Invalid partial')
    }
  }

  /**
   * Changes the local currentAccount.
   * @param address is the account/address to set 
   */
  changeAccount(address){    
    if (this.inboxPartial != 'messages') {
      this.changeView('messages');
    }
    this.currentAccount = address
    this.localStorageAccountService.setCurrentAccount(this.currentAccount)
  }

  /**
   * Changes the network and fetches mails for that network.
   */
  changeNetwork(){    
    if (this.inboxPartial != 'messages') {
      this.changeView('messages');
    }
    this.localStorageServerService.setCurrentNetwork(this.currentNetwork)
    this.getMails()
  }

  /**
   * Removes the session storage currentAccount setting
   */
  removeCurrentAccount(){
    this.localStorageAccountService.removeCurrentAccount()
  }

  /**
   * Removes the session storage currentNetwork setting
   */
  removeCurrentNetwork(){
    this.localStorageServerService.removeCurrentNetwork()
  }

  /**
   * Changes the server settings in the client from form data.
   * @param form is the settings form submitted from the view
   */
  public serverSettingsFormSubmit(){ 

    var webProtocol = this.serverSettings["webProtocol"]
    var host = this.serverSettings["host"]
    var port = this.serverSettings["port"]
    var settingsHash = {}
    
    if ( webProtocol != undefined && webProtocol != this.currentWebProtocol ) {      
      settingsHash["web-protocol"] = webProtocol
    }
    if ( host != undefined && host != this.currentHost ) {
      settingsHash["host"] = host
    }
    if ( port != undefined && port != this.currentPort ) {      
      settingsHash["port"] = port
    }
    this.updateServerSettings(settingsHash)
  }

  /**
   * Updates the server settings and reloads the current path. The reload is intended to remove url params and reload a clean component.
   * @param settingsHash the server settings hash
   * `{ "web-protocol": "http"|"https", "host": "127.0.0.1", "port": "8080" }`
   */
  async updateServerSettings(settingsHash: any){
    let serverSettingsChanged: boolean = false
    
    if (
      settingsHash["web-protocol"] != undefined &&
      settingsHash["web-protocol"] != this.currentWebProtocol
    ) {      
      this.localStorageServerService.setCurrentWebProtocol(settingsHash["web-protocol"])
      serverSettingsChanged = true
    }
    if (
      settingsHash["host"] != undefined &&
      settingsHash["host"] != this.currentHost
    ) {
      this.localStorageServerService.setCurrentHost(settingsHash["host"])
      serverSettingsChanged = true
    }
    if (
      settingsHash["port"] != undefined &&
      settingsHash["port"] != this.currentPort
    ) {      
      this.localStorageServerService.setCurrentPort(settingsHash["port"])
      serverSettingsChanged = true
    }

    if (serverSettingsChanged) {
      this.removeCurrentAccount();
      this.removeCurrentNetwork();

      this.windowReload()
    }

  }

  /**
   * Reload the window with the original path.
   * Used to remove url params and reload a clean component
   */
  public windowReload() {
    let path = window.location.pathname
    window.location.replace(path)
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
  public addressIsActive(address){
    return address == this.currentAccount
  }

  /**
   * Creates a list of 'from' addresses (i.e. sender addresses) formatted as a hash with the following fields:
   * label: the address
   * value: the address
   * messageCount: a hash containing folder values of message count:
   *   inbox: default 0
   */
  async setFromAddressList(){
    this.fromAddressesKeys = await this.addressesService.getAddresses();
    
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
    let protocols
    this.protocolsService.getProtocols().subscribe(res => {      
      protocols = res["protocols"]
      if (protocols.length > 0) {
        protocols.forEach(protocol => {
          if (protocol["name"] == "ethereum" ) {
            protocol["networks"].forEach(network => {
              this.networks.push({
                label: network["name"],
                value: network["name"],
              })
            });
          }
        });
      }
    });
  }

  /**
   * Set the list of web protocols in the server settings dropdown
   */
  setCurrentWebProtocolsList(){
    var currentWebProtocols = this.mailchainService.getWebProtocols();
    currentWebProtocols.forEach(network => {
      this.currentWebProtocols.push({
        label: network,
        value: network,
      })
    });
  }

  /**
   * Fetch account identicons for all fromAddresses and set the address value in accountIdenticons.
   */
  setAccountIdenticons() {
    this.fromAddressesKeys.forEach(address => {
      this.accountIdenticons[address] = this.mailchainService.generateIdenticon(address)
    });    
  }

  /**
   * Lookup name records for addresses
   */
  setAccountNameRecords() {
    this.fromAddressesKeys.forEach(address => {
      this.nameserviceService.resolveAddress(this.currentProtocol,this.currentNetwork,address).subscribe(res =>{        
        if ( res['ok'] ) {
          this.accountNameRecord[address] = res['body']['name']
        }
      })
    }); 
  }
  
  /**
   * Initiates the server settings form with default values. Default values are retrieved from local storage
   */
  setupServerSettingsForm() {
    this.serverSettings = {
      webProtocol: this.currentWebProtocol,
      host: this.currentHost,
      port: this.currentPort
    }
  }

  /**
   * Checks for server setting query params in the url. If present, it will call updateServerSettings with the relevant settings
   * e.g. http://localhost:4200/#/?web-protocol=http&host=127.0.0.1&port=8080
   * web-protocol=http
   * host=127.0.0.1
   * port=8080
   */
  checkServerSettingsInQueryParams(){
    let serverParams: any[] = ["web-protocol", "host", "port"]
    let serverSettings: any = {}
    let serverSettingsPresent: boolean = false

    this.activatedRoute.queryParamMap.subscribe(paramsAsMap => {
      paramsAsMap.keys.filter(v => serverParams.includes(v)).forEach(val => {
        serverSettingsPresent = true
        serverSettings[val] = paramsAsMap["params"][val]
      })
      if (serverSettingsPresent) {
        this.updateServerSettings(serverSettings)
      }
    })
  }

  async ngOnInit(): Promise<void> {
    this.setFetchingMessagesState(true)

    try {
      this.currentAccount = await this.localStorageAccountService.getCurrentAccount()
      this.currentNetwork = this.localStorageServerService.getCurrentNetwork()
      this.getServerSettings()
    } catch (error) {
      this.getServerSettings()
     // @TODO add error handling for failure to reach server
      console.warn("error: " + error);
      console.warn("error: it doesn't look like your application is running. Please check your settings.");

    }
    await this.checkServerSettingsInQueryParams()

    this.setCurrentWebProtocolsList()
    this.setNetworkList()
    this.setupServerSettingsForm()

    await this.setFromAddressList()
    this.getMails()
    this.setAccountIdenticons()
    this.setAccountNameRecords()
  }
  

  /**
   * Fetch mails from the server
   * @param quietMode (default: false) when true, messages are quietly loaded
   */
  public getMails(quietMode: boolean = false){

    this.setFetchingMessagesState(true, quietMode)

    let fetchCount = this.fromAddressesKeys.length // we count this down for each req

    this.fromAddressesKeys.forEach(address => {
      var self = this
      this.messagesService.getMessages(address, this.currentNetwork).subscribe(function(res){
        
        self.processUnreadMessagesInboxCounter(address, res["body"]["messages"])
        self.processInboxMessages(res["body"]["messages"])
        
        --fetchCount // decrement fetchCount
        
        if (fetchCount == 0 ) { // all get requests should be complete
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
      messages,
      {status: "ok", readState: false}
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
      messages,
      {status: "ok"}
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
  private setFetchMessagesText(statusCode: number){
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
  addMailToInboxMessages(decryptedMsg){  
    decryptedMsg.senderIdenticon = this.mailchainService.generateIdenticon(decryptedMsg.headers.from)
    var msg = {
      ...new InboundMail,
      ...decryptedMsg
    }
    this.inboxMessages.push(msg)
  }

}
