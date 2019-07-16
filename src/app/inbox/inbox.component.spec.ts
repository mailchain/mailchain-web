import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxComponent } from './inbox.component';
import { InboxMessagesComponent } from './inbox-messages/inbox-messages.component';
import { InboxMessageComponent } from './inbox-message/inbox-message.component';
import { InboxComposeComponent } from './inbox-compose/inbox-compose.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from '../services/helpers/http-helpers/http-helpers.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageAccountService } from '../services/helpers/local-storage-account/local-storage-account.service';
import { LocalStorageServerService } from '../services/helpers/local-storage-server/local-storage-server.service';
import { MessagesService } from '../services/mailchain/messages/messages.service';
import { of } from 'rxjs';
import { MailchainTestService } from '../test/test-helpers/mailchain-test.service';
import { AddressesService } from '../services/mailchain/addresses/addresses.service';
import { ProtocolsService } from '../services/mailchain/protocols/protocols.service';


describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let mailchainTestService: MailchainTestService
  let protocolsService: ProtocolsService
  let localStorageAccountService: LocalStorageAccountService
  let localStorageServerService: LocalStorageServerService
  let networkList: any
  let currentWebProtocolsList: any
  let inboundMessage: any
  
  const currentAccount = '0x0123456789012345678901234567890123456789';
  const currentAccount2 = '0x0123456789abcdef0123456789abcdef01234567';
  const currentNetwork = 'testnet';
  const currentWebProtocol = 'https';
  const currentHost = 'example.com';
  const currentPort = '8080';
  const addresses = [currentAccount, currentAccount2];
  
  let localStorageCurrentAccount: string
  let localStorageCurrentNetwork: string


  class LocalStorageAccountServiceStub {
    getCurrentAccount(){
      return localStorageCurrentAccount
    }
    setCurrentAccount(address){
      localStorageCurrentAccount = address
    }
    removeCurrentAccount(){}
  }

  class LocalStorageServerServiceStub {
    getCurrentWebProtocol(){
      return currentWebProtocol
    }
    getCurrentHost(){
      return currentHost
    }
    getCurrentPort(){
      return currentPort
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
    removeCurrentNetwork(){}
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
        { provide: MessagesService, useClass: MessagesServiceStub }

      ],
      imports: [
        HttpClientModule,
        ModalModule.forRoot(),
        FormsModule,
        RouterTestingModule
      ]

    })
    .compileComponents();
    mailchainTestService = TestBed.get(MailchainTestService);
    protocolsService = TestBed.get(ProtocolsService);
    localStorageAccountService = TestBed.get(LocalStorageAccountService);
    localStorageServerService = TestBed.get(LocalStorageServerService);
    
  }));
  
  beforeEach(() => {
    /* Set Values */
    localStorageCurrentAccount = currentAccount
    localStorageCurrentNetwork = currentNetwork
    
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
  
  describe('setNetworkList', () => {
    beforeEach(() => {
      networkList = mailchainTestService.networkList();
    });

    it('should populate the network list', () => {
      expect(fixture.componentInstance.networks).toEqual([]);
      fixture.componentInstance.setNetworkList()
      expect(fixture.componentInstance.networks).toEqual(networkList)
    });
  });
  
  describe('setCurrentWebProtocolsList', () => {
    beforeEach(() => {
      currentWebProtocolsList = mailchainTestService.currentWebProtocolsList()
    });

    it('should populate the web protocols', () => {
      expect(fixture.componentInstance.currentWebProtocols).toEqual([]);
      fixture.componentInstance.setCurrentWebProtocolsList()
      expect(fixture.componentInstance.currentWebProtocols).toEqual(currentWebProtocolsList)
    });

  });

  describe('composeMessage', () => {
    
    it('should change the view to "compose"', () => {
      fixture.componentInstance.composeMessage()
      expect(fixture.componentInstance.inboxPartial).toEqual('compose')
    });
    it('should handle being passed a message', () => {
      let message = mailchainTestService.inboundMessage();

      fixture.componentInstance.composeMessage(message)
      expect(fixture.componentInstance.currentMessage).toEqual(message)
    });
    it('should handle NOT being passed a message', () => {
      fixture.componentInstance.composeMessage()
      expect(fixture.componentInstance.currentMessage).toEqual(undefined)
    });
  });

  describe('changeView', () => {
    it('should change the view when given a valid partial', () => {
      let partials = [ "messages", "message", "compose"]
      partials.forEach(partial => {
        fixture.componentInstance.changeView(partial)
        expect(fixture.componentInstance.inboxPartial).toEqual(partial)
      })
    });

    it('should throw an error when passed an invalid patial', () => {
      spyOn(console, 'error');
      fixture.componentInstance.changeView("invalidPartial")
      expect(console.error).toHaveBeenCalledWith('Error: Invalid partial');
    });

    it('should not change the partial when passed an invalid patial', () => {
      let inboxPartial = fixture.componentInstance.inboxPartial
      fixture.componentInstance.changeView("invalidPartial")
      expect(fixture.componentInstance.inboxPartial).toEqual(inboxPartial)
    });
  });
  
  describe('onInboxCounter', () => {
    beforeEach(()=>{
      fixture.componentInstance.fromAddresses = {
        [currentAccount]: {
          "messageCount": { "inbox": 5 }
        },
        [currentAccount2]: {
          "messageCount": { "inbox": 2 }
        }
      }
    });

    it('should change the message count for an address', () => {
      fixture.componentInstance.onInboxCounter([currentAccount2, 6])
      expect(fixture.componentInstance.fromAddresses[currentAccount2]["messageCount"]["inbox"]).toEqual(6)
    });

    it('should NOT change another message count for an address', () => {
      fixture.componentInstance.onInboxCounter([currentAccount2, 6])
      expect(fixture.componentInstance.fromAddresses[currentAccount]["messageCount"]["inbox"]).toEqual(5)
    });
  });

  describe('onOpenMessage', () => {
    beforeEach(() => {
      inboundMessage = mailchainTestService.inboundMessage
    });

    it('should change the view to "message"', () => {
      fixture.componentInstance.onOpenMessage(inboundMessage)
      expect(fixture.componentInstance.inboxPartial).toEqual("message")
    });
    it('should set the currentMessage to the passed in mail value', () => {
      expect(fixture.componentInstance.currentMessage).not.toEqual(inboundMessage)

      fixture.componentInstance.onOpenMessage(inboundMessage)
      
      expect(fixture.componentInstance.currentMessage).toEqual(inboundMessage)
    });
  });

  describe('changeAccount', () => {
    it('should change inboxPartial to "messages" if not already "messages"', () => {
      fixture.componentInstance.inboxPartial = "compose"
      fixture.componentInstance.changeAccount(currentAccount2)
      expect(fixture.componentInstance.inboxPartial).toEqual("messages")
    });

    it('should set currentAccount to address value', () => {
      expect(fixture.componentInstance.currentAccount).not.toEqual(currentAccount2)

      fixture.componentInstance.changeAccount(currentAccount2)
      expect(fixture.componentInstance.currentAccount).toEqual(currentAccount2)
    });

    it('should set the localStorage value for currentAccount to address value', async() => {
      expect(await localStorageAccountService.getCurrentAccount()).not.toEqual(currentAccount2)

      fixture.componentInstance.changeAccount(currentAccount2)
      expect(await localStorageAccountService.getCurrentAccount()).toEqual(currentAccount2)
      
    });
  });

  describe('changeNetwork', () => {
    it('should change inboxPartial to "messages" if not already "messages"', () => {
      fixture.componentInstance.inboxPartial = "compose"
      fixture.componentInstance.changeNetwork()
      expect(fixture.componentInstance.inboxPartial).toEqual("messages")
    });

    it('should trigger the "getMails" function', async() => {
      spyOn(fixture.componentInstance, 'getMails');
      
      fixture.componentInstance.changeNetwork();
      expect(fixture.componentInstance.getMails).toHaveBeenCalled();
    });

    it('should set the localStorage value for currentNetwork to network value', async() => {
      expect(await localStorageServerService.getCurrentNetwork()).not.toEqual('myTestNet')

      fixture.componentInstance.currentNetwork = 'myTestNet';
      fixture.componentInstance.changeNetwork();

      expect(await localStorageServerService.getCurrentNetwork()).toEqual('myTestNet')
    });
  });
  
  describe('removeCurrentAccount', () => {
    it('should call the localStorageAccountService.removeCurrentAccount function', () => {
      spyOn(localStorageAccountService, 'removeCurrentAccount');
      
      fixture.componentInstance.removeCurrentAccount();
      expect(localStorageAccountService.removeCurrentAccount).toHaveBeenCalled();
    });
  });
  
  describe('removeCurrentNetwork', () => {
    it('should call the localStorageServerService.removeCurrentNetwork function', () => {
      spyOn(localStorageServerService, 'removeCurrentNetwork');
      
      fixture.componentInstance.removeCurrentNetwork();
      expect(localStorageServerService.removeCurrentNetwork).toHaveBeenCalled();
    });
  });

  describe('serverSettingsFormSubmit', () => {
    it('should set the webProtocol value from the form', () => {
      let myProtocol = 'myProtocol'
      let serverSettingsForm = <NgForm>{
        value: {
          serverSettingsWebProtocol: myProtocol
        }
      };
      console.log(serverSettingsForm);
      
      expect(fixture.componentInstance.currentWebProtocol).not.toEqual(myProtocol)
      
      fixture.componentInstance.serverSettingsFormSubmit(serverSettingsForm)
      expect(fixture.componentInstance.currentWebProtocol).toEqual(myProtocol)
      
    });
    xit('should set the host value from the form', () => {
    });
    xit('should set the port value from the form', () => {
    });
    xit('should NOT set the values that are not defined in the form', () => {
    });
    xit('should call updateServerSettings with the settingsHash', () => {
    });

  });
  describe('updateServerSettings', () => {
    xit('should change the view to "compose"', () => {
    });
  });
  describe('getServerSettings', () => {
    xit('should change the view to "compose"', () => {
    });
  });
  describe('setFromAddressList', () => {
    xit('should change the view to "compose"', () => {
    });
  });
  describe('setAccountIdenticons', () => {
    xit('should change the view to "compose"', () => {
    });
  });
  describe('setupServerSettingsForm', () => {
    xit('should change the view to "compose"', () => {
    });
  });
  describe('checkServerSettingsInQueryParams', () => {
    xit('should change the view to "compose"', () => {
    });
  });
  describe('ngOnInit', () => {
    xit('should change the view to "compose"', () => {
    });
  });
  describe('getMails', () => {
    xit('should change the view to "compose"', () => {
    });
  });
  describe('addMailToInboxMessages', () => {
    xit('should change the view to "compose"', () => {
    });
  });


});
