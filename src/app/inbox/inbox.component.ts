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
    private addressesService: AddressesService,
    private protocolsService: ProtocolsService,
    private mailchainService: MailchainService,
    private messagesService: MessagesService,
    private activatedRoute: ActivatedRoute,
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
   */
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
   * Changes the server settings in the client from form data.
   * @param form is the settings form submitted from the view
   */
  serverSettingsFormSubmit(form: NgForm){    
    var webProtocol = form["form"]["value"]["serverSettingsWebProtocol"]
    var host = form["form"]["value"]["serverSettingsHost"]
    var port = form["form"]["value"]["serverSettingsPort"]
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
  async updateServerSettings(
    settingsHash: any
  ){
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

      let path = window.location.pathname
      window.location.replace(path)
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

  /**
   * Returns true or false for whether the address is the active currentAccount
   * @param address the address to query
   */
  public addressIsActive(address){
    return address == this.currentAccount
  }


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
          protocol["networks"].forEach(network => {
            this.networks.push({
              label: network,
              value: network,
            })
          });
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
   * Initiates the server settings form with default values
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
    try {
      this.currentAccount = await this.localStorageAccountService.getCurrentAccount()
      this.currentNetwork = this.localStorageServerService.getCurrentNetwork()
      this.getServerSettings()
    } catch (error) {
      this.getServerSettings()
     // @TODO add error handling for failure to reach server
     console.warn("error: " + error);
     console.log("error: it doesn't look like your application is running. Please check your settings.");
     
    }
    await this.checkServerSettingsInQueryParams()

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
