import { Component, OnInit } from '@angular/core';
import { LocalStorageAccountService } from '../services/helpers/local-storage-account/local-storage-account.service';
import { PublicKeyService } from '../services/mailchain/public-key/public-key.service';
import { MailchainService } from '../services/mailchain/mailchain.service';
import { MessagesService } from '../services/mailchain/messages/messages.service';
import { InboundMail } from '../models/inbound-mail';
import { NgForm } from '@angular/forms';
import { LocalStorageServerService } from '../services/helpers/local-storage-server/local-storage-server.service';

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
  public fetchMessagesText: String = "Check Messages";
  
  public inboxPartial: string = 'messages'

  public currentAccount: string;
  public currentNetwork: string;
  public currentMail: any;
  public currentMessage: any;

  public currentWebProtocol: string;
  public currentHost: string;
  public currentPort: string;
  public serverSettings: any = {};
  
  public accountIdenticons: any = {};


  constructor(
    private localStorageAccountService: LocalStorageAccountService,
    private localStorageServerService: LocalStorageServerService,
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
    this.localStorageAccountService.setCurrentAccount(this.currentAccount)
  }

  /**
   * Changes the network and fetches mails for that network.
   */
  changeNetwork(){    
    this.changeView('messages')
    this.localStorageServerService.setCurrentNetwork(this.currentNetwork)
    this.getMails()
  }

  /**
   * Removes the session storage account setting
   */
  removeCurrentAccount(){
    this.localStorageAccountService.removeCurrentAccount()
    
  }

  /**
   * Removes the session storage network setting
   */
  removeCurrentNetwork(){
    this.localStorageServerService.removeCurrentNetwork()
  }

  /**
   * Changes the server settings in the client.
   */
  serverSettingsFormSubmit(form: NgForm){    
    // serverSettingsForm
    var webProtocol = form["form"]["value"]["serverSettingsWebProtocol"]
    var host = form["form"]["value"]["serverSettingsHost"]
    var port = form["form"]["value"]["serverSettingsPort"]
    var formChanged = false
    
    if ( webProtocol != undefined && webProtocol != this.currentWebProtocol ) {      
      this.localStorageServerService.setCurrentWebProtocol(webProtocol)
      formChanged = true
    }
    if ( host != undefined && host != this.currentHost ) {
      this.localStorageServerService.setCurrentHost(host)
      formChanged = true
    }
    if ( port != undefined && port != this.currentPort ) {      
      this.localStorageServerService.setCurrentPort(port)
      formChanged = true
    }
    if (formChanged) {
      this.removeCurrentAccount();
      this.removeCurrentNetwork();

      window.location.reload()
    }
  }

  /**
   * Retrieve the current server settings for the inbox
   */
  public getServerSettings() {
    this.currentWebProtocol = this.localStorageServerService.getCurrentWebProtocol()
    this.currentHost = this.localStorageServerService.getCurrentHost()
    this.currentPort = this.localStorageServerService.getCurrentPort()  
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
  
  /**
   * Initiates the server settings form with default values
   */
  setupServerSettingsForm() {
    this.serverSettings = {
      webProtocol: this.currentWebProtocol,
      host: this.currentHost,
      port: this.currentPort
    }
  }

  async ngOnInit(): Promise<void> {
    
    try {
      this.currentAccount = await this.localStorageAccountService.getCurrentAccount()
      this.currentNetwork = this.localStorageServerService.getCurrentNetwork()
      this.getServerSettings()
    } catch (error) {
      this.getServerSettings()
     // @TODO add error handling for failure to reach server
     console.log("error: it doesn't loogk like your application is running. Please check your settings.");
     
    }
    
    this.setCurrentWebProtocolsList()
    this.setNetworkList()
    this.setupServerSettingsForm()

    await this.setFromAddressList()
    this.getMails()
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
