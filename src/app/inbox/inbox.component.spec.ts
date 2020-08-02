import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { convertToParamMap, ParamMap } from '@angular/router';

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
import { LocalStorageServerServiceStub } from '../services/helpers/local-storage-server/local-storage-server.service.stub';
import { AddressesServiceStub } from '../services/mailchain/addresses/addresses.service.stub';
import { MessagesServiceStub } from '../services/mailchain/messages/messages.service.stub';
import { ProtocolsServiceStub } from '../services/mailchain/protocols/protocols.service.stub';
import { NameserviceServiceStub } from '../services/mailchain/nameservice/nameservice.service.stub';
import { LocalStorageAccountServiceStub } from '../services/helpers/local-storage-account/local-storage-account.service.stub';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let mailchainTestService: MailchainTestService
  let protocolsService: ProtocolsService
  let localStorageAccountService: LocalStorageAccountService
  let localStorageServerService: LocalStorageServerService
  let mailchainService: MailchainService
  let nameserviceService: NameserviceService
  let addressesService: AddressesService
  let activatedRoute: any
  let networkList: any
  let currentWebProtocolsList: any
  let inboundMessage: any

  const currentAccount = '0x0123456789012345678901234567890123456789';
  const currentAccount2 = '0x0123456789abcdef0123456789abcdef01234567';
  const currentAccountNameLookup = 'myaddress.eth';
  const currentAccount2NameLookup = 'someaddress.myaddress.eth';

  const currentWebProtocol = 'https';
  const currentHost = 'example.com';
  const currentPort = '8080';
  const addresses = [currentAccount, currentAccount2];

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        InboxComponent,
        InboxMessagesComponent,
        InboxMessageComponent,
        InboxComposeComponent,
      ],
      providers: [
        HttpHelpersService,
        { provide: LocalStorageAccountService, useClass: LocalStorageAccountServiceStub },
        { provide: LocalStorageServerService, useClass: LocalStorageServerServiceStub },
        { provide: AddressesService, useClass: AddressesServiceStub },
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        { provide: MessagesService, useClass: MessagesServiceStub },
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
    addressesService = TestBed.get(AddressesService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    component.currentProtocol = 'ethereum'
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
      let partials = ["messages", "message", "compose"]
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
    beforeEach(() => {
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

    it('should set the localStorage value for currentAccount to address value', async () => {
      expect(await localStorageAccountService.getCurrentAccount()).not.toEqual(currentAccount2)

      component.changeAccount(currentAccount2)
      expect(await localStorageAccountService.getCurrentAccount()).toEqual(currentAccount2)

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
    it('should populate the fromAddresses', async () => {
      await component.setFromAddressList()

      expect(Object.keys(component.fromAddresses)).toEqual(mailchainTestService.senderAddresses())
    });
    it('should set the label to the address value', async () => {
      await component.setFromAddressList()
      let keys = Object.keys(component.fromAddresses)

      keys.forEach(key => {
        expect(component.fromAddresses[key]["label"]).toEqual(key)
      })
    });
    it('should set the value to the address value', async () => {
      await component.setFromAddressList()
      let keys = Object.keys(component.fromAddresses)

      keys.forEach(key => {
        expect(component.fromAddresses[key]["value"]).toEqual(key)
      })
    });
    it('should initialize the messageCount to 0 for inbox', async () => {
      await component.setFromAddressList()
      let keys = Object.keys(component.fromAddresses)

      keys.forEach(key => {
        expect(component.fromAddresses[key]["messageCount"]["inbox"]).toEqual(0)
      })
    });
  });

  describe('setAccountIdenticons', () => {
    it('should generate identicons for each fromAddress', () => {
      component.fromAddressesKeys = [currentAccount, currentAccount2]
      component.setAccountIdenticons()
      let protocol = 'ethereum'
      expect(component.accountIdenticons[currentAccount]).toEqual(mailchainService.generateIdenticon(protocol, currentAccount))

      expect(component.accountIdenticons[currentAccount2]).toEqual(mailchainService.generateIdenticon(protocol, currentAccount2))
      component.fromAddresses
    });
  });

  describe('setAccountNameRecords', () => {
    it('should lookup a name each fromAddress', () => {
      component.fromAddressesKeys = [currentAccount, currentAccount2]
      component.setAccountNameRecords()

      expect(component.accountNameRecord[currentAccount]).toEqual(currentAccountNameLookup)

      expect(component.accountNameRecord[currentAccount2]).toEqual(currentAccount2NameLookup)

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
      expect(component.onInboxCounter).toHaveBeenCalledWith([currentAccount, 1])
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
      expect(component.inboxMessages.map(msg => msg["headers"]["message-id"])).toEqual(["00", "02"]);
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
    const messages = []

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
      let protocol = 'ethereum'
      let identicon = mailchainService.generateIdenticon(protocol, message.headers.from)
      let obj = component.inboxMessages[0]

      expect(obj["senderIdenticon"]).toEqual(identicon)
    });

  });


});
