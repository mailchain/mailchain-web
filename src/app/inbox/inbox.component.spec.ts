import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BehaviorSubject, of} from 'rxjs';
import {convertToParamMap, ParamMap} from '@angular/router';

import { InboxComponent } from './inbox.component';
import { InboxMessagesComponent } from './inbox-messages/inbox-messages.component';
import { InboxMessageComponent } from './inbox-message/inbox-message.component';
import { InboxComposeComponent } from './inbox-compose/inbox-compose.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from '../services/helpers/http-helpers/http-helpers.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageAccountService } from '../services/helpers/local-storage-account/local-storage-account.service';
import { LocalStorageServerService } from '../services/helpers/local-storage-server/local-storage-server.service';
import { MessagesService } from '../services/mailchain/messages/messages.service';
import { MailchainTestService } from '../test/test-helpers/mailchain-test.service';
import { AddressesService } from '../services/mailchain/addresses/addresses.service';
import { ProtocolsService } from '../services/mailchain/protocols/protocols.service';
import { MailchainService } from '../services/mailchain/mailchain.service';
import { ActivatedRoute } from '@angular/router';
import { NameserviceService } from '../services/mailchain/nameservice/nameservice.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let mailchainTestService: MailchainTestService
  let protocolsService: ProtocolsService
  let localStorageAccountService: LocalStorageAccountService
  let localStorageServerService: LocalStorageServerService
  let mailchainService: MailchainService
  let nameserviceService: NameserviceService
  let activatedRoute: any
  let networkList: any
  let currentWebProtocolsList: any
  let inboundMessage: any
  
  const currentProtocol: string = "ethereum"
  const currentAccount = '0x0123456789012345678901234567890123456789';
  const currentAccount2 = '0x0123456789abcdef0123456789abcdef01234567';
  const currentAccountNameLookup = 'myaddress.eth';
  const currentAccount2NameLookup = 'someaddress.myaddress.eth';

  const currentNetwork = 'testnet';
  const currentWebProtocol = 'https';
  const currentHost = 'example.com';
  const currentPort = '8080';
  const addresses = [currentAccount, currentAccount2];
  
  let localStorageCurrentWebProtocol: string
  let localStorageCurrentPort: string
  let localStorageCurrentHost: string
  let localStorageCurrentAccount: string
  let localStorageCurrentNetwork: string
  let localStorageCurrentProtocol: string

  class LocalStorageAccountServiceStub {
    getCurrentAccount(){
      return localStorageCurrentAccount
    }
    setCurrentAccount(address){
      localStorageCurrentAccount = address
    }
    removeCurrentAccount(){
      localStorageCurrentAccount = undefined
    }
  }

  class LocalStorageServerServiceStub {
    getCurrentWebProtocol(){
      return localStorageCurrentWebProtocol
    }
    setCurrentWebProtocol(protocol){
      localStorageCurrentWebProtocol = protocol
    }
    getCurrentHost(){
      return localStorageCurrentHost
    }
    setCurrentHost(host){
      localStorageCurrentHost = host
    }
    getCurrentPort(){
      return localStorageCurrentPort
    }
    setCurrentPort(port){
      localStorageCurrentPort = port
    }
    getCurrentNetwork(){
      return localStorageCurrentNetwork
    }
    setCurrentNetwork(network){
      localStorageCurrentNetwork = network
    }
    getCurrentServerDetails(){
      return `${currentWebProtocol}://${currentHost}:${currentPort}`
    }
    removeCurrentNetwork(){
      localStorageCurrentNetwork = undefined
    }
  }
  class AddressesServiceStub {
    getAddresses(){
      return addresses
    }
  }
  class MessagesServiceStub {    
    getMessages() {
      let messages = mailchainTestService.messagesResponse
      return of(messages)
    }
  }
  class ProtocolsServiceStub {    
    getProtocols() {
      return of(mailchainTestService.protocolsServerResponse())
    }
  }
  class NameserviceServiceStub {
    resolveAddress(protocol,network,value) {      
      let returnVals = {}
      returnVals[currentAccount]  = currentAccountNameLookup,
      returnVals[currentAccount2] = currentAccount2NameLookup

      return of(
        {
          "body": { name: returnVals[value] },
          "ok": true
        }
      )
    }
  }

  class ActivatedRouteStub {
    //Observable that contains a map of the parameters
    private subjectParamMap = new BehaviorSubject(convertToParamMap(this.testParamMap));
    paramMap = this.subjectParamMap.asObservable();

    private _testParamMap: ParamMap;
    get testParamMap() {
        return this._testParamMap;
    }
    set testParamMap(params: {}) {
        this._testParamMap = convertToParamMap(params);
        this.subjectParamMap.next(this._testParamMap);
    }

    //Observable that contains a map of the query parameters
    private subjectQueryParamMap = new BehaviorSubject(convertToParamMap(this.testParamMap));
    queryParamMap = this.subjectQueryParamMap.asObservable();

    private _testQueryParamMap: ParamMap;
    get testQueryParamMap() {
        return this._testQueryParamMap;
    }
    set testQueryParamMap(params: {}) {
        this._testQueryParamMap = convertToParamMap(params);
        this.subjectQueryParamMap.next(this._testQueryParamMap);
    }

    get snapshot() {
        return {
            paramMap: this.testParamMap,
            queryParamMap: this.testQueryParamMap
        }
    }
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        InboxComponent,
        InboxMessagesComponent,
        InboxMessageComponent,
        InboxComposeComponent,
      ],
      providers:[
        HttpHelpersService,
        { provide: LocalStorageAccountService, useClass: LocalStorageAccountServiceStub },
        { provide: LocalStorageServerService, useClass: LocalStorageServerServiceStub },
        { provide: AddressesService, useClass: AddressesServiceStub },
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        { provide: MessagesService, useClass: MessagesServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: NameserviceService, useClass: NameserviceServiceStub }

      ],
      imports: [
        CKEditorModule,
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        RouterTestingModule
      ]

    })
    .compileComponents();
    mailchainTestService = TestBed.get(MailchainTestService);
    protocolsService = TestBed.get(ProtocolsService);
    localStorageAccountService = TestBed.get(LocalStorageAccountService);
    localStorageServerService = TestBed.get(LocalStorageServerService);
    mailchainService = TestBed.get(MailchainService);
    nameserviceService = TestBed.get(NameserviceService);
    
  }));
  
  beforeEach(() => {
    /* Set Values */
    localStorageCurrentWebProtocol = currentWebProtocol
    localStorageCurrentPort = currentPort
    localStorageCurrentHost = currentHost
    localStorageCurrentAccount = currentAccount
    localStorageCurrentNetwork = currentNetwork
    localStorageCurrentProtocol = currentProtocol
    
    /* End Set Values */


    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  })
  
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  

  describe('composeMessage', () => {
    
    it('should change the view to "compose"', () => {
      component.composeMessage()
      expect(component.inboxPartial).toEqual('compose')
    });
    it('should handle being passed a message', () => {
      let message = mailchainTestService.inboundMessage();

      component.composeMessage(message)
      expect(component.currentMessage).toEqual(message)
    });
    it('should handle NOT being passed a message', () => {
      component.composeMessage()
      expect(component.currentMessage).toEqual(undefined)
    });
  });

  describe('changeView', () => {
    it('should change the view when given a valid partial', () => {
      let partials = [ "messages", "message", "compose"]
      partials.forEach(partial => {
        component.changeView(partial)
        expect(component.inboxPartial).toEqual(partial)
      })
    });

    it('should throw an error when passed an invalid patial', () => {
      spyOn(console, 'error');
      component.changeView("invalidPartial")
      expect(console.error).toHaveBeenCalledWith('Error: Invalid partial');
    });

    it('should not change the partial when passed an invalid patial', () => {
      let inboxPartial = component.inboxPartial
      component.changeView("invalidPartial")
      expect(component.inboxPartial).toEqual(inboxPartial)
    });
  });
  
  describe('onInboxCounter', () => {
    beforeEach(()=>{
      component.fromAddresses = {
        [currentAccount]: {
          "messageCount": { "inbox": 5 }
        },
        [currentAccount2]: {
          "messageCount": { "inbox": 2 }
        }
      }
    });

    it('should change the message count for an address', () => {
      component.onInboxCounter([currentAccount2, 6])
      expect(component.fromAddresses[currentAccount2]["messageCount"]["inbox"]).toEqual(6)
    });

    it('should NOT change another message count for an address', () => {
      component.onInboxCounter([currentAccount2, 6])
      expect(component.fromAddresses[currentAccount]["messageCount"]["inbox"]).toEqual(5)
    });
  });

  describe('onOpenMessage', () => {
    beforeEach(() => {
      inboundMessage = mailchainTestService.inboundMessage
    });

    it('should change the view to "message"', () => {
      component.onOpenMessage(inboundMessage)
      expect(component.inboxPartial).toEqual("message")
    });
    it('should set the currentMessage to the passed in mail value', () => {
      expect(component.currentMessage).not.toEqual(inboundMessage)

      component.onOpenMessage(inboundMessage)
      
      expect(component.currentMessage).toEqual(inboundMessage)
    });
  });

  describe('changeAccount', () => {
    it('should change inboxPartial to "messages" if not already "messages"', () => {
      component.inboxPartial = "compose"
      component.changeAccount(currentAccount2)
      expect(component.inboxPartial).toEqual("messages")
    });

    it('should set currentAccount to address value', () => {
      expect(component.currentAccount).not.toEqual(currentAccount2)

      component.changeAccount(currentAccount2)
      expect(component.currentAccount).toEqual(currentAccount2)
    });

    it('should set the localStorage value for currentAccount to address value', async() => {
      expect(await localStorageAccountService.getCurrentAccount()).not.toEqual(currentAccount2)

      component.changeAccount(currentAccount2)
      expect(await localStorageAccountService.getCurrentAccount()).toEqual(currentAccount2)
      
    });
  });

  describe('changeNetwork', () => {
    it('should change inboxPartial to "messages" if not already "messages"', () => {
      component.inboxPartial = "compose"
      component.changeNetwork()
      expect(component.inboxPartial).toEqual("messages")
    });

    it('should trigger the "getMails" function', async() => {
      spyOn(component, 'getMails');
      
      component.changeNetwork();
      expect(component.getMails).toHaveBeenCalled();
    });

    it('should set the localStorage value for currentNetwork to network value', async() => {
      expect(await localStorageServerService.getCurrentNetwork()).not.toEqual('myTestNet')

      component.currentNetwork = 'myTestNet';
      component.changeNetwork();

      expect(await localStorageServerService.getCurrentNetwork()).toEqual('myTestNet')
    });
  });
  
  describe('removeCurrentAccount', () => {
    it('should call the localStorageAccountService.removeCurrentAccount function', () => {
      spyOn(localStorageAccountService, 'removeCurrentAccount');
      
      component.removeCurrentAccount();
      expect(localStorageAccountService.removeCurrentAccount).toHaveBeenCalled();
    });
  });
  
  describe('removeCurrentNetwork', () => {
    it('should call the localStorageServerService.removeCurrentNetwork function', () => {
      spyOn(localStorageServerService, 'removeCurrentNetwork');
      
      component.removeCurrentNetwork();
      expect(localStorageServerService.removeCurrentNetwork).toHaveBeenCalled();
    });
  });

  describe('serverSettingsFormSubmit', () => {
    beforeEach(() => {
      spyOn(component, 'windowReload').and.callFake(function(){});
    });

    it('should set the webProtocol value from the form', async() => {
      await component.ngOnInit()
      expect(localStorageServerService.getCurrentWebProtocol()).toEqual('https')
      expect(component.serverSettings["webProtocol"]).toEqual('https')

      component.serverSettings["webProtocol"] = 'http'
      component.serverSettingsFormSubmit()

      expect(localStorageServerService.getCurrentWebProtocol()).toEqual('http')
      
    });
    xit('should set the host value from the form', async() => {
      
    });
    xit('should set the port value from the form', async() => {

    });
    xit('should NOT set the values that are not defined in the form', async() => {

    });
    xit('should call updateServerSettings with the settingsHash', async() => {

    });

  });
  describe('updateServerSettings', () => {
    beforeEach(() => {
      spyOn(component, 'windowReload').and.callFake(function(){});
    });
    
    it('should set the webProtocol value from the settingsHash',  async() => {
      let settingsHash = {
        "web-protocol": "customproto"
      }
      component.updateServerSettings(settingsHash)
      
      expect(localStorageServerService.getCurrentWebProtocol()).toEqual('customproto')

      expect(component.windowReload).toHaveBeenCalled();
    });
    it('should set the host value from the settingsHash', async() => {
      let settingsHash = {
        "host": "example.com"
      }
      component.updateServerSettings(settingsHash)
      fixture.detectChanges();
      
      expect(await localStorageServerService.getCurrentHost()).toEqual('example.com')

      expect(component.windowReload).toHaveBeenCalled();
    });
    it('should set the port value from the settingsHash', async() => {
      let settingsHash = {
        "port": "8888"
      }
      component.updateServerSettings(settingsHash)
      fixture.detectChanges();

      expect(await localStorageServerService.getCurrentPort()).toEqual('8888')

      expect(component.windowReload).toHaveBeenCalled();
    });
    
    it('should reload the current path if serverSettings are changed"', () => {
      let settingsHash = {
        "web-protocol": "customproto"
      }
      component.updateServerSettings(settingsHash)
      fixture.detectChanges();

      expect(component.windowReload).toHaveBeenCalled();
    });
    it('should NOT reload the current path if serverSettings are NOT changed"', () => {
      let settingsHash = {}
      component.updateServerSettings(settingsHash)
      fixture.detectChanges();

      expect(component.windowReload).not.toHaveBeenCalled();
    });
    it('should remove the currentAccount if serverSettings are changed"', async() => {
      let settingsHash = {
        "web-protocol": "customproto"
      }
      localStorageAccountService.setCurrentAccount("accountVal")
      expect(await localStorageAccountService.getCurrentAccount()).toEqual("accountVal")

      component.updateServerSettings(settingsHash)
      fixture.detectChanges();
      
      expect(await localStorageAccountService.getCurrentAccount()).toBeUndefined()
    });
    it('should NOT remove the currentAccount if serverSettings are NOT NOT changed"', async() => {
      let settingsHash = {}
      localStorageAccountService.setCurrentAccount("accountVal")
      expect(await localStorageAccountService.getCurrentAccount()).toEqual("accountVal")

      component.updateServerSettings(settingsHash)
      fixture.detectChanges();
      
      expect(await localStorageAccountService.getCurrentAccount()).toEqual("accountVal");
    });
    
    it('should remove the currentNetwork if serverSettings are changed"', async() => {
      let settingsHash = {
        "web-protocol": "customproto"
      }
      localStorageServerService.setCurrentNetwork("networkVal")
      expect(await localStorageServerService.getCurrentNetwork()).toEqual("networkVal")

      component.updateServerSettings(settingsHash)
      fixture.detectChanges();
      
      expect(await localStorageServerService.getCurrentNetwork()).toBeUndefined()
    });
    it('should NOT remove the currentNetwork if serverSettings are NOT changed"', async() => {
      let settingsHash = {}
      localStorageServerService.setCurrentNetwork("networkVal")
      expect(await localStorageServerService.getCurrentNetwork()).toEqual("networkVal")

      component.updateServerSettings(settingsHash)
      fixture.detectChanges();
      
      expect(await localStorageServerService.getCurrentNetwork()).toEqual("networkVal");
    });

  });


  describe('windowReload', () => {
    xit('should reload the component with the same path', () => {
      // TODO
    });
    
    xit('should remove any params in the url', () => {
      // TODO
    });
  });

  describe('getServerSettings', () => {
    it('should set the currentWebProtocol to the value foundin localStorage"', () => {
      let val = 'webProtocolVal'
      
      localStorageServerService.setCurrentWebProtocol(val)
      expect(component.currentWebProtocol).not.toEqual(val)

      component.getServerSettings()
      expect(component.currentWebProtocol).toEqual(val)
      
    });
    it('should set the currentHost to the value foundin localStorage"', () => {
      let val = 'hostVal'
      
      localStorageServerService.setCurrentWebProtocol(val)
      expect(component.currentWebProtocol).not.toEqual(val)

      component.getServerSettings()
      expect(component.currentWebProtocol).toEqual(val)
    });
    it('should set the currentPort to the value foundin localStorage"', () => {
      let val = 'portVal'
      
      localStorageServerService.setCurrentWebProtocol(val)
      expect(component.currentWebProtocol).not.toEqual(val)

      component.getServerSettings()
      expect(component.currentWebProtocol).toEqual(val)
    });
  });

  describe('addressIsActive', () => {
    it('should return true if the address is equal to the currentAccount', () => {
      component.currentAccount = currentAccount
      expect(component.addressIsActive(currentAccount)).toEqual(true)
    });
    it('should return false if the address is NOT equal to the currentAccount', () => {
      component.currentAccount = currentAccount2
      expect(component.addressIsActive(currentAccount)).not.toEqual(true)
    });
  });

  describe('setFromAddressList', () => {
    beforeEach(() => {
      component.fromAddresses = {}
    });
    it('should populate the fromAddresses', async() => {
      await component.setFromAddressList()
      
      expect(Object.keys(component.fromAddresses)).toEqual(addresses)
    });
    it('should add a new address then this has been added ', async() => {
      addresses.push("0x0000000000abcdef0123456789abcdef00000000")
      await component.setFromAddressList()
      
      expect(Object.keys(component.fromAddresses)).toEqual(addresses)
      addresses.pop()

    });
    it('should set the label to the address value', async() => {
      await component.setFromAddressList()      
      let keys = Object.keys(component.fromAddresses)
      
      keys.forEach(key => {
        expect(component.fromAddresses[key]["label"]).toEqual(key)
      })
    });
    it('should set the value to the address value', async() => {
      await component.setFromAddressList()      
      let keys = Object.keys(component.fromAddresses)
  
      keys.forEach(key => {
        expect(component.fromAddresses[key]["value"]).toEqual(key)
      })
    });
    it('should initialize the messageCount to 0 for inbox', async() => {
      await component.setFromAddressList()      
      let keys = Object.keys(component.fromAddresses)
  
      keys.forEach(key => {
        expect(component.fromAddresses[key]["messageCount"]["inbox"]).toEqual(0)
      })
    });
  });

  describe('setNetworkList', () => {
    beforeEach(() => {
      networkList = mailchainTestService.networkList();
    });

    it('should populate the network list', () => {
      expect(component.networks).toEqual([]);
      component.setNetworkList()
      expect(component.networks).toEqual(networkList)
    });
  });
  
  describe('setCurrentWebProtocolsList', () => {
    beforeEach(() => {
      currentWebProtocolsList = mailchainTestService.currentWebProtocolsList()
    });

    it('should populate the web protocols', () => {
      expect(component.currentWebProtocols).toEqual([]);
      component.setCurrentWebProtocolsList()
      expect(component.currentWebProtocols).toEqual(currentWebProtocolsList)
    });

  });

  describe('setAccountIdenticons', () => {
    it('should generate identicons for each fromAddress', () => {
      component.fromAddressesKeys = [currentAccount,currentAccount2]
      component.setAccountIdenticons()
      
      expect(component.accountIdenticons[currentAccount]).toEqual(mailchainService.generateIdenticon(currentAccount))

      expect(component.accountIdenticons[currentAccount2]).toEqual(mailchainService.generateIdenticon(currentAccount2))
      component.fromAddresses
    });
  });

  describe('setAccountNameRecords', () => {
    it('should lookup a name each fromAddress', () => {
      component.fromAddressesKeys = [currentAccount,currentAccount2]
      component.setAccountNameRecords()
            
      expect(component.accountNameRecord[currentAccount]).toEqual(currentAccountNameLookup)

      expect(component.accountNameRecord[currentAccount2]).toEqual(currentAccount2NameLookup)

    });
  });
  
  describe('setupServerSettingsForm', () => {
    it('should initialize values for the form', () => {
      let obj = {
        webProtocol: currentWebProtocol,
        host: currentHost,
        port: currentPort
      }
      
      expect(component.serverSettings).toEqual({})
      
      component.currentWebProtocol = currentWebProtocol
      component.currentHost = currentHost
      component.currentPort = currentPort
      component.setupServerSettingsForm()
      
      expect(component.serverSettings).toEqual(obj)
    });
  });
  describe('checkServerSettingsInQueryParams', () => {
    let wpVal = 'zttps'
    let hostVal = 'someexample.com'
    let portVal = '2019'

    beforeEach(()=>{
      activatedRoute = fixture.debugElement.injector.get(ActivatedRoute) as any;
      
      
      spyOn(component, 'windowReload').and.callFake(function(){});
      // activatedRoute.testParamMap = {category: 'api-02'};
      // activatedRoute.testQueryParamMap = {period:'2018',size:'14'};
    })

    it('should update serverSettings if params are present', () => { 
      activatedRoute.testQueryParamMap = {
        "web-protocol":wpVal,
        "host":hostVal,
        "port":portVal
      };
      
      component.checkServerSettingsInQueryParams()
      expect(localStorageServerService.getCurrentWebProtocol()).toEqual(wpVal)
      expect(localStorageServerService.getCurrentHost()).toEqual(hostVal)
      expect(localStorageServerService.getCurrentPort()).toEqual(portVal)
    });

    it('should NOT update webProtocol serverSettings if webProtocol param is NOT present', () => {
      let originalVal = localStorageServerService.getCurrentWebProtocol()
      
      activatedRoute.testQueryParamMap = {
        // "web-protocol":wpVal,
        "host":hostVal,
        "port":portVal
      };

      component.checkServerSettingsInQueryParams()
      expect(localStorageServerService.getCurrentWebProtocol()).not.toEqual(wpVal)
      expect(localStorageServerService.getCurrentWebProtocol()).toEqual(originalVal)
    });
    it('should NOT update host serverSettings if host param is NOT present', () => {
      let originalVal = localStorageServerService.getCurrentHost()

      activatedRoute.testQueryParamMap = {
        "web-protocol":wpVal,
        // "host":hostVal,
        "port":portVal
      };

      component.checkServerSettingsInQueryParams()
      expect(localStorageServerService.getCurrentHost()).not.toEqual(hostVal)
      expect(localStorageServerService.getCurrentHost()).toEqual(originalVal)
    });
    it('should NOT update port serverSettings if port param is NOT present', () => {
      let originalVal = localStorageServerService.getCurrentPort()

      activatedRoute.testQueryParamMap = {
        "web-protocol":wpVal,
        "host":hostVal,
        // "port":portVal
      };

      component.checkServerSettingsInQueryParams()
      expect(localStorageServerService.getCurrentPort()).not.toEqual(portVal)
      expect(localStorageServerService.getCurrentPort()).toEqual(originalVal)
    });

  });

  describe('getMails', () => {
    xit('should fetch mails from the server', () => {
    });
    xit('should fetch mails in the background by default (quietly)', () => {
    });
    xit('should refetch mails as a clean fetch (NOT quietly)', () => {
    });
    xit('should set the fetchCount', () => {
    });


    xit('should fetch mails for each fromAddress', () => {
    });
    xit('should handle unread mails', () => {
    });
    xit('should ignore messages with message status NOT "ok"', () => {
    });
    xit('should add messages with message status "ok" to inbox', () => {
      component.getMails.prototype.fil
    });
    xit('should handle unread mails', () => {
    });
    xit('should increment inbox counters for addresses', () => {
    });


    xit('should set messagesLoaded to TRUE when all addresses have been retrieved', () => {
    });
    xit('should set fetchMessagesDisabled to FALSE when all addresses have been retrieved', () => {
    });
  });
  
  describe('processUnreadMessagesInboxCounter', () => {
    it('should call onInboxCounter with the correct params', () => {
      spyOn(component, 'onInboxCounter')
      const messages = [
        {
          "headers": {
            "message-id": "00"
          },
          "read": true,
          "status": "ok",
        },
        {
          "headers": {
            "message-id": "01"
          },
          "read": true,
          "status": "error",
        },
        {
          "headers": {
            "message-id": "02"
          },
          "read": false,
          "status": "ok",
        },
        {
          "headers": {
            "message-id": "03"
          },
          "read": false,
          "status": "error",
        }
      ]
      component.processUnreadMessagesInboxCounter(currentAccount, messages)
      expect(component.onInboxCounter).toHaveBeenCalledWith([currentAccount,1])
    });
  });
  
  describe('processInboxMessages', () => {
    const messages = [
      {
        "headers": {
          "message-id": "00",
          "from": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",

        },
        "read": true,
        "status": "ok",
      },
      {
        "headers": {
          "message-id": "01",
          "from": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",

        },
        "read": true,
        "status": "error",
      },
      {
        "headers": {
          "message-id": "02",
          "from": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",

        },
        "read": false,
        "status": "ok",
      },
      {
        "headers": {
          "message-id": "03",
          "from": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",

        },
        "read": false,
        "status": "error",
      }
    ]
    
    it('should add valid messages to inboxMessages', () => {
      expect(component.inboxMessages).toEqual([])
      component.processInboxMessages(messages)
      expect(component.inboxMessages.map(msg => msg["headers"]["message-id"])).toEqual(["00","02"]);
    });
  });
  
  describe('setFetchingMessagesState', () => {
    describe('fetchMessagesText', () => {
      it('should set fetchMessagesText to "Check Messages" when state is false', () => {
        component.setFetchingMessagesState(false)
        expect(component.fetchMessagesText).toEqual("Check Messages")
      });
      it('should set fetchMessagesText to "Loading..." when state is true', () => {
        component.setFetchingMessagesState(true)
        expect(component.fetchMessagesText).toEqual("Loading...")
      });
    });
    
    describe('fetchMessagesDisabled', () => {
      it('should set fetchMessagesDisabled to true when state is true', () => {
        component.fetchMessagesDisabled = false
        component.setFetchingMessagesState(true)
        expect(component.fetchMessagesDisabled).toBe(true)
      });
      it('should set fetchMessagesDisabled to false when state is true', () => {
        component.fetchMessagesDisabled = true
        component.setFetchingMessagesState(false)
        expect(component.fetchMessagesDisabled).toBe(false)
      });
    });
    
    describe('messagesLoaded', () => {
      it('should set messagesLoaded to false when NOT in quietMode', () => {
        component.setFetchingMessagesState(true, false)
        expect(component.messagesLoaded).toBe(false)
      });
      it('should NOT set messagesLoaded to false when in quietMode', () => {
        component.messagesLoaded = true
        component.setFetchingMessagesState(true, true)
        expect(component.messagesLoaded).toBe(true)

        component.messagesLoaded = false
        component.setFetchingMessagesState(true, true)
        expect(component.messagesLoaded).toBe(false)
      });
      it('should set messagesLoaded to false when quietMode is NOT defined', () => {
        component.messagesLoaded = true
        component.setFetchingMessagesState(true)
        expect(component.messagesLoaded).toBe(false)
      });
    });
  });

  describe('addMailToInboxMessages', () => {
    const message = {
      "headers": {
        "date": "2019-06-07T14:53:36Z",
        "from": "\u003c0x0123456789012345678901234567890123456789@testnet.ethereum\u003e",
        "to": "\u003c0x0123456789abcdef0123456789abcdef01234567@testnet.ethereum\u003e",
        "message-id": "0020c"
      },
      "body": "",
      "subject": "Re: Mailchain Test!",
      "status": "ok",
      "status-code": "",
      "read": true
    }

    it('should add a message to inboxMessages', () => {      
      expect(component.inboxMessages).toEqual([])
      
      component.addMailToInboxMessages(message)
      let obj = component.inboxMessages[0]

      expect(component.inboxMessages.length).toEqual(1)

    })
    
    it('should set the `headers` field', () => {
      component.addMailToInboxMessages(message)
      let obj = component.inboxMessages[0]

      expect(obj["headers"]["message-id"]).toEqual(message["headers"]["message-id"])
      expect(obj["headers"]).toEqual(message["headers"])
    });

    it('should set the `subject` field', () => {
      component.addMailToInboxMessages(message)
      let obj = component.inboxMessages[0]
      
      expect(obj["subject"]).toEqual(message["subject"])
    });

    it('should set the `body` field', () => {
      component.addMailToInboxMessages(message)
      let obj = component.inboxMessages[0]

      expect(obj["body"]).toEqual(message["body"])
    });

    it('should set the `read` field', () => {
      component.addMailToInboxMessages(message)
      let obj = component.inboxMessages[0]

      expect(obj["read"]).toEqual(message["read"])
    });

    it('should set the `selected` field', () => {
      component.addMailToInboxMessages(message)
      let obj = component.inboxMessages[0]

      expect(obj["selected"]).toEqual(false)
    });

    it('should set the `senderIdenticon` field', () => {
      component.addMailToInboxMessages(message)
      let identicon = mailchainService.generateIdenticon(message.headers.from)
      let obj = component.inboxMessages[0]

      expect(obj["senderIdenticon"]).toEqual(identicon)
    });

  });


});
