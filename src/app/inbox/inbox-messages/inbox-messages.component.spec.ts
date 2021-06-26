import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InboxMessagesComponent } from './inbox-messages.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/services/helpers/http-helpers/http-helpers.service';
import { MailchainService } from 'src/app/services/mailchain/mailchain.service';
import { ReadService } from 'src/app/services/mailchain/messages/read.service';
import { of } from 'rxjs';
import { NameserviceService } from 'src/app/services/mailchain/nameservice/nameservice.service';
import { ReadServiceStub } from 'src/app/services/mailchain/messages/read.service.stub';
import { NameserviceServiceStub } from 'src/app/services/mailchain/nameservice/nameservice.service.stub';
import { ProtocolsService } from 'src/app/services/mailchain/protocols/protocols.service';
import { ProtocolsServiceStub } from 'src/app/services/mailchain/protocols/protocols.service.stub';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

describe('InboxMessagesComponent', () => {
  let component: InboxMessagesComponent;
  let fixture: ComponentFixture<InboxMessagesComponent>;
  let mailchainService: MailchainService
  let readService: ReadService;
  let nameserviceService: NameserviceService;
  let protocolsService: ProtocolsService;
  let mailchainTestService: MailchainTestService


  const address1 = "0x0123456789012345678901234567890123456789"
  const address2 = "0xbbb0000000000000000000000000000000000000"
  const address3 = "0xabc000000000000000000000000000000000000a"
  const addresses = [address1, address2, address3]


  // id 00: unread & status ok;
  //        from: address 2
  //        to:   address 1
  // id 01: unread & status ok;
  //        from: address 2
  //        to:   address 1
  // id 02: unread & status error;
  //        from: address 2
  //        to:   address 1
  // id 03: unread & status ok;
  //        from: address 1
  //        to:   address 2
  // id 04: read & status ok;
  //        from: address 1
  //        to:   address 2
  // id 05: read & status error;
  //        from: address 1
  //        to:   address 2
  // id 06: addresses uppercase;
  //        from: address 2
  //        to:   address 3
  // id 07: addresses lowercase;
  //        from: address 2
  //        to:   address 3
  // id 08: addresses lowercase (SUBSTRATE);
  //        from: substrate address 1
  //        to:   substrate address 2
  // id 09: TO address uppercase (SUBSTRATE);
  //        from: substrate address 1
  //        to:   substrate address 2
  
  const messages = [
    {
      "headers": {
        "from": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
        "to": "<0x0123456789012345678901234567890123456789@ropsten.ethereum>",
        "message-id": "00"
      },
      "read": false,
      "status": "ok",
      "subject": "Message 00"
    },
    {
      "headers": {
        "from": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
        "to": "<0x0123456789012345678901234567890123456789@ropsten.ethereum>",
        "message-id": "01"
      },
      "read": false,
      "status": "ok",
      "subject": "Message 01"
    },
    {
      "headers": {
        "from": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
        "to": "<0x0123456789012345678901234567890123456789@ropsten.ethereum>",
        "message-id": "02"
      },
      "read": false,
      "status": "error",
      "subject": "Message 02"
    },
    {
      "headers": {
        "from": "<0x0123456789012345678901234567890123456789@ropsten.ethereum>",
        "to": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
        "message-id": "03"
      },
      "read": false,
      "status": "ok",
      "subject": "Message 03"
    },
    {
      "headers": {
        "from": "<0x0123456789012345678901234567890123456789@ropsten.ethereum>",
        "to": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
        "message-id": "04"
      },
      "read": true,
      "status": "ok",
      "subject": "Message 04"
    },
    {
      "headers": {
        "from": "<0x0123456789012345678901234567890123456789@ropsten.ethereum>",
        "to": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
        "message-id": "05"
      },
      "read": true,
      "status": "error",
      "subject": "Message 05"
    },
    {
      "headers": {
        "from": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
        "to": "<0xABC000000000000000000000000000000000000A@ropsten.ethereum>",
        "message-id": "06"
      },
      "read": false,
      "status": "ok",
      "subject": "Message 06"
    },
    {
      "headers": {
        "from": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
        "to": "<0xabc000000000000000000000000000000000000a@ropsten.ethereum>",
        "message-id": "07"
      },
      "read": false,
      "status": "ok",
      "subject": "Message 07"
    },
    {
      "headers": {
        "from": "<5F4HMyes8GNWzpSDjTPSh61Aw6RTaWmZKwKvszocwqbsdn4h@edgeware-mainnet.substrate>",
        "to": "<5CaLgJUDdDRxw6KQXJY2f5hFkMEEGHvtUPQYDWdSbku42Dv2@edgeware-mainnet.substrate>",
        "message-id": "08"
      },
      "read": false,
      "status": "ok",
      "subject": "Message 08"
    },
    {
      "headers": {
        "from": "<5F4HMyes8GNWzpSDjTPSh61Aw6RTaWmZKwKvszocwqbsdn4h@edgeware-mainnet.substrate>",
        "to": "<5CALGJUDDDRXW6KQXJY2F5HFKMEEGHVTUPQYDWDSBKU42DV2@edgeware-mainnet.substrate>",
        "message-id": "09"
      },
      "read": false,
      "status": "ok",
      "subject": "Message 09"
    },
  ]


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxMessagesComponent
      ],
      providers: [
        HttpHelpersService,
        MailchainService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        { provide: ReadService, useClass: ReadServiceStub },
        { provide: NameserviceService, useClass: NameserviceServiceStub },

      ],
      imports: [
        FormsModule,
        HttpClientModule,
      ]
    })
      .compileComponents();
    mailchainService = TestBed.inject(MailchainService);
    protocolsService = TestBed.inject(ProtocolsService);
    readService = TestBed.inject(ReadService);
    nameserviceService = TestBed.inject(NameserviceService);
    mailchainTestService = TestBed.inject(MailchainTestService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxMessagesComponent);
    component = fixture.componentInstance;
    component.currentAccount = "";
    component.searchText = '';
    component.inboxMessages = [];
    component.currentProtocol = 'ethereum'
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emitInboxCount', () => {

    it('should emit the the number of unread, valid messages for each address', () => {
      spyOn(component.inboxCounter, 'emit')
      component.inboxMessages = messages
      component.emitInboxCount(addresses)

      expect(component.inboxCounter.emit).toHaveBeenCalledWith([
        address1,
        2
      ])
      expect(component.inboxCounter.emit).toHaveBeenCalledWith([
        address2,
        1
      ])
    })
  });

  describe('resolveSendersFromMessages', () => {
    it('should include resolved names in messagesNameRecords', async () => {
      await component.resolveSendersFromMessages(messages)
      expect(component.messagesNameRecords[address1]).toEqual("myaddress.eth")
    })
    it('should not include unresolved names in messagesNameRecords', async () => {
      await component.resolveSendersFromMessages(messages)
      expect(component.messagesNameRecords[address2]).toEqual(undefined)
    })
  })

  describe('addMailToInboxMessages', () => {

    it('should add senderIdenticon to each message', () => {
      let protocol = 'ethereum'
      let addrIcon1 = mailchainService.generateIdenticon(protocol, address1);
      let addrIcon2 = mailchainService.generateIdenticon(protocol, address2);
      let defaultIcon = mailchainService.mailchainLogoIdenticonImage()
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })

      component.inboxMessages.forEach((val, index) => {
        let icon
        
        if ( [0,1,2, 6,7,].includes(index) ){
          icon = addrIcon2
        } else if ([3,4,5].includes(index)) {
          icon = addrIcon1
        } else if ([8,9].includes(index)) {
          icon = defaultIcon // SUBSTRATE not supported
        };

        expect(val['senderIdenticon']).toEqual(icon);
      });
    });

    it('should merge header field from the decrypted message', () => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })

      component.inboxMessages.forEach((val, index) => {
        expect(val['headers']).toEqual(
          messages[index]["headers"]
        )
      });

    });

    it('should merge subject field from the decrypted message', () => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })

      component.inboxMessages.forEach((val, index) => {
        expect(val['subject']).toEqual(
          messages[index]["subject"]
        )
      });

    });

    it('should NOT set a subject field if none is specified on the decrypted message', () => {
      let message = {
        "headers": {
          "from": "<0x0123456789012345678901234567890123456789@ropsten.ethereum>",
          "to": "<0xbbb0000000000000000000000000000000000000@ropsten.ethereum>",
          "message-id": "05"
        },
        "read": true,
        "status": "error",
      }

      component.addMailToInboxMessages(message)
      expect(component.inboxMessages[0]["subject"]).toEqual("No Subject")
    });

  });
  describe('openMail', () => {
    beforeEach(() => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })
    })
    it('should call the readService.markRead with the mail headers ', () => {
      spyOn(readService, "markRead").and.callThrough()

      component.openMail(component.inboxMessages[2])

      expect(readService.markRead).toHaveBeenCalledWith(messages[2]["headers"]["message-id"])
    })

    it('should mark the component mail as read', () => {
      component.openMail(component.inboxMessages[2])

      expect(component.inboxMessages[2]["read"]).toBe(true)
    })
    it('should call the openMessage.emit function with the mail as an input', () => {
      spyOn(component.openMessage, "emit")

      component.openMail(component.inboxMessages[2])

      expect(component.openMessage.emit).toHaveBeenCalledWith(component.inboxMessages[2])
    })
    it('should call the emitInboxCount method with the TO address as an input', () => {
      spyOn(component, "emitInboxCount")

      component.openMail(component.inboxMessages[3])

      expect(component.emitInboxCount).toHaveBeenCalledWith([address2])
    })
  });

  describe('selectMail', () => {
    beforeEach(() => {
      component.addMailToInboxMessages(messages[0])
      component.addMailToInboxMessages(messages[1])
    });

    it('should select a message in the inboxMessages array', () => {
      expect(component.inboxMessages[0]["selected"]).toBe(false)

      component.selectMail(component.inboxMessages[0])

      expect(component.inboxMessages[0]["selected"]).toBe(true)
    })

    it('should NOT select other messages in the inboxMessages array', () => {
      expect(component.inboxMessages[1]["selected"]).toBe(false)

      component.selectMail(component.inboxMessages[0])

      expect(component.inboxMessages[1]["selected"]).toBe(false)
    })

    it('should de-select a message in the inboxMessages array', () => {
      component.inboxMessages[0]["selected"] = true

      component.selectMail(component.inboxMessages[0])

      expect(component.inboxMessages[0]["selected"]).toBe(false)
    })

    it('should NOT de-select other messages in the inboxMessages array', () => {
      component.inboxMessages[0]["selected"] = true
      component.inboxMessages[1]["selected"] = true

      component.selectMail(component.inboxMessages[0])

      expect(component.inboxMessages[1]["selected"]).toBe(true)
    })
  });

  describe('selectAll', () => {
    it('should select all messages in the currentAccountInboxMessages', () => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })
      component.currentAccountInboxMessages.push(
        component.inboxMessages[0],
        component.inboxMessages[1]
      )

      component.currentAccountInboxMessages.forEach(msg => {
        expect(msg.selected).toBe(false)
      })

      component.selectAll()

      component.currentAccountInboxMessages.forEach(msg => {
        expect(msg.selected).toBe(true)
      })
    })
  });
  describe('selectNone', () => {
    it('should ', () => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })
      component.currentAccountInboxMessages.push(
        component.inboxMessages[0],
        component.inboxMessages[1]
      )

      component.currentAccountInboxMessages.forEach(msg => {
        msg.selected = true
        expect(msg.selected).toBe(true)
      })

      component.selectNone()

      component.currentAccountInboxMessages.forEach(msg => {
        expect(msg.selected).toBe(false)
      })
    })
  });

  describe('selectRead', () => {
    beforeEach(() => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })
      component.currentAccountInboxMessages.push(
        component.inboxMessages[3],
        component.inboxMessages[4],
        component.inboxMessages[5]
      )
    })

    it('should select read messages', () => {
      component.currentAccountInboxMessages.forEach(msg => {
        expect(msg.selected).toBe(false)
      })

      component.selectRead()

      expect(component.currentAccountInboxMessages[0]["selected"]).toBe(false)
      expect(component.currentAccountInboxMessages[1]["selected"]).toBe(true)
      expect(component.currentAccountInboxMessages[2]["selected"]).toBe(true)
    })
    it('should handle when other messages are already selected', () => {

      component.currentAccountInboxMessages[0]["selected"] = true

      component.selectRead()

      expect(component.currentAccountInboxMessages[0]["selected"]).toBe(false)
      expect(component.currentAccountInboxMessages[1]["selected"]).toBe(true)
      expect(component.currentAccountInboxMessages[2]["selected"]).toBe(true)
    })
  });
  describe('selectUnread', () => {
    beforeEach(() => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })
      component.currentAccountInboxMessages.push(
        component.inboxMessages[3],
        component.inboxMessages[4],
        component.inboxMessages[5]
      )
    })

    it('should select unread messages', () => {
      component.currentAccountInboxMessages.forEach(msg => {
        expect(msg.selected).toBe(false)
      })

      component.selectUnread()

      expect(component.currentAccountInboxMessages[0]["selected"]).toBe(true)
      expect(component.currentAccountInboxMessages[1]["selected"]).toBe(false)
      expect(component.currentAccountInboxMessages[2]["selected"]).toBe(false)
    })
    it('should handle when other messages are already selected', () => {

      component.currentAccountInboxMessages[1]["selected"] = true

      component.selectUnread()

      expect(component.currentAccountInboxMessages[0]["selected"]).toBe(true)
      expect(component.currentAccountInboxMessages[1]["selected"]).toBe(false)
      expect(component.currentAccountInboxMessages[2]["selected"]).toBe(false)
    })
  });
  describe('markSelectedAsRead', () => {
    beforeEach(() => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })
      component.currentAccountInboxMessages.push(
        component.inboxMessages[3],
        component.inboxMessages[4],
        component.inboxMessages[5]
      )
    })

    it('should mark a selected message as read', () => {
      component.currentAccountInboxMessages[0]["selected"] = true

      component.markSelectedAsRead()

      expect(component.currentAccountInboxMessages[0]["read"]).toBe(true);
    })
    it('should NOT mark an unselected message as read', () => {
      component.markSelectedAsRead()

      expect(component.currentAccountInboxMessages[0]["read"]).toBe(false);
    })
    it('should call the readService.markRead for the each selected message id', () => {
      spyOn(readService, 'markRead').and.callThrough()

      component.currentAccountInboxMessages[0]["selected"] = true
      component.currentAccountInboxMessages[1]["selected"] = true

      component.markSelectedAsRead()

      expect(readService.markRead).toHaveBeenCalledWith(component.currentAccountInboxMessages[0]["headers"]["message-id"])
      expect(readService.markRead).toHaveBeenCalledWith(component.currentAccountInboxMessages[1]["headers"]["message-id"])
    })
    it('should NOT call the readService.markRead for unselected message ids', () => {
      spyOn(readService, 'markRead').and.callThrough()

      component.currentAccountInboxMessages[0]["selected"] = true
      component.currentAccountInboxMessages[1]["selected"] = true

      component.markSelectedAsRead()

      expect(readService.markRead).not.toHaveBeenCalledWith(component.currentAccountInboxMessages[2]["headers"]["message-id"])
    })
    it('should call emitInboxCount for the currentAccount', () => {
      spyOn(component, "emitInboxCount");

      component.currentAccountInboxMessages[0]["selected"] = true

      component.markSelectedAsRead()

      expect(component.emitInboxCount).toHaveBeenCalledWith([address2])
    })
  });
  describe('markSelectedAsUnread', () => {
    beforeEach(() => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })
      component.currentAccountInboxMessages.push(
        component.inboxMessages[3],
        component.inboxMessages[4],
        component.inboxMessages[5]
      )
    })

    it('should mark a selected message as unread', () => {
      component.currentAccountInboxMessages[1]["selected"] = true

      component.markSelectedAsUnread()

      expect(component.currentAccountInboxMessages[1]["read"]).toBe(false);
    })
    it('should NOT mark an unselected message as unread', () => {
      component.markSelectedAsUnread()

      expect(component.currentAccountInboxMessages[2]["read"]).toBe(true);
    })
    it('should call the readService.markUnread for the each selected message id', () => {
      spyOn(readService, 'markUnread').and.callThrough()

      component.currentAccountInboxMessages[0]["selected"] = true
      component.currentAccountInboxMessages[1]["selected"] = true

      component.markSelectedAsUnread()

      expect(readService.markUnread).toHaveBeenCalledWith(component.currentAccountInboxMessages[0]["headers"]["message-id"])
      expect(readService.markUnread).toHaveBeenCalledWith(component.currentAccountInboxMessages[1]["headers"]["message-id"])
    })
    it('should NOT call the readService.markUnread for unselected message ids', () => {
      spyOn(readService, 'markUnread').and.callThrough()

      component.currentAccountInboxMessages[0]["selected"] = true
      component.currentAccountInboxMessages[1]["selected"] = true

      component.markSelectedAsUnread()

      expect(readService.markUnread).not.toHaveBeenCalledWith(component.currentAccountInboxMessages[2]["headers"]["message-id"])
    })
    it('should call emitInboxCount for the currentAccount', () => {
      spyOn(component, "emitInboxCount");

      component.currentAccountInboxMessages[0]["selected"] = true

      component.markSelectedAsUnread()

      expect(component.emitInboxCount).toHaveBeenCalledWith([address2])
    })
  });
  describe('ngOnInit', () => {
    it('should call getCurrentAccountInboxMessages', async () => {
      spyOn(component, "getCurrentAccountInboxMessages")
      await component.ngOnInit()
      expect(component.getCurrentAccountInboxMessages).toHaveBeenCalled()
    })
  });
  describe('getCurrentAccountInboxMessages', () => {
    beforeEach(() => {
      messages.forEach(msg => {
        component.addMailToInboxMessages(msg)
      })
    })
    it('should set currentAccountInboxMessages to the currently selected account', async () => {
      component.currentAccount = address2
      await component.getCurrentAccountInboxMessages()

      expect(component.currentAccountInboxMessages).toEqual([
        component.inboxMessages[3],
        component.inboxMessages[4],
        component.inboxMessages[5]
      ])
    })
    it('should filter currentAccountInboxMessages based on search text', async () => {
      component.currentAccount = address2
      component.searchText = "Message 04"
      await component.getCurrentAccountInboxMessages()

      expect(component.currentAccountInboxMessages).toEqual([
        component.inboxMessages[4]
      ])
    })
    it('should dedupe currentAccountInboxMessages', async () => {
      component.currentAccount = address2
      component.inboxMessages.push(component.inboxMessages[4])
      await component.getCurrentAccountInboxMessages()

      expect(component.currentAccountInboxMessages).toEqual([
        component.inboxMessages[3],
        component.inboxMessages[4],
        component.inboxMessages[5]
      ])
    })

    describe('and case sensitivity', () => {
      describe('for ethereum', () => {
        it('should be case insensitive', async () => {
          component.currentAccount = address3
          await component.getCurrentAccountInboxMessages()

          expect(component.currentAccountInboxMessages).toEqual([
            component.inboxMessages[6],
            component.inboxMessages[7]
          ])
          
        });
      });
      describe('for substrate', () => {
        it('should be case sensitive', async () => {
          component.currentAccount = "5CaLgJUDdDRxw6KQXJY2f5hFkMEEGHvtUPQYDWdSbku42Dv2"
          component.currentProtocol = "substrate"
          await component.getCurrentAccountInboxMessages()

          expect(component.currentAccountInboxMessages).toEqual([
            component.inboxMessages[8]
          ])
        });
      });
    });
  });
  describe('ngOnChanges', () => {
    xit('should selectNone if "event" contains "currentAccount"', () => {
      // event = new Event
    })

    xit('should call getCurrentAccountInboxMessages', async () => {
      // spyOn(component,"getCurrentAccountInboxMessages")
      // component.ngOnChanges()
      // expect(component.getCurrentAccountInboxMessages).toHaveBeenCalled()  
    })
  });
});
