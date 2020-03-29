import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxMessageComponent } from './inbox-message.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpHelpersService } from 'src/app/services/helpers/http-helpers/http-helpers.service';
import { MailchainService } from 'src/app/services/mailchain/mailchain.service';
import { of } from 'rxjs';
import { NameserviceService } from 'src/app/services/mailchain/nameservice/nameservice.service';
import { HttpClientModule } from '@angular/common/http';

describe('InboxMessageComponent', () => {

  let component: InboxMessageComponent;
  let fixture: ComponentFixture<InboxMessageComponent>;
  let mailchainService: MailchainService;
  let nameserviceService: NameserviceService;

  let mailchainTestService: MailchainTestService

  const address1 = "0x0000000000000000000000000000000000000001"
  const mcAddress1 = "<" + address1 + "@ropsten.ethereum>"
  const address2 = "0x0000000000000000000000000000000000000002"
  const mcAddress2 = "<" + address2 + "@ropsten.ethereum>"

  /**
 * Resolves address1: myname.eth
 * Throws 404 error for address2
 */
  class NameserviceServiceStub {
    resolveAddress(protocol, network, value) {
      if (value == address1) {
        return of(
          {
            "body": { name: "myname.eth" },
            "ok": true
          }
        )
      } else {
        return of({ "status": 404 })
      }
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxMessageComponent,
      ],
      providers: [
        HttpHelpersService,
        MailchainService,
        { provide: NameserviceService, useClass: NameserviceServiceStub },
      ],
      imports: [
        ModalModule.forRoot(),
        RouterTestingModule,
        HttpClientModule,

      ]
    })
      .compileComponents();
    mailchainTestService = TestBed.get(MailchainTestService);
    nameserviceService = TestBed.get(NameserviceService);
    mailchainService = TestBed.get(MailchainService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxMessageComponent);
    component = fixture.componentInstance;

    component.currentMessage = mailchainTestService.inboundMessage();

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('returnToInboxMessages', () => {
    it('should call goToInboxMessages.emit() to change the view to  "messages"', () => {
      spyOn(component.goToInboxMessages, 'emit')

      component.returnToInboxMessages()
      expect(component.goToInboxMessages.emit).toHaveBeenCalledWith('')
    })
  });

  describe('replyToMessage', () => {
    it('should call replyToMessage.emit() to change the view to "message" with the currentMessage', () => {
      spyOn(component.replyToMessage, 'emit')

      component.replyToMsg()
      expect(component.replyToMessage.emit).toHaveBeenCalledWith(component.currentMessage)
    })
  });

  describe('ngOnInit', () => {
    describe('resolveNamesFromMessage', () => {
      it('should resolve the To field when there is a resolvable name', () => {
        component.currentMessage["headers"]["to"] = mcAddress1
        component.ngOnInit()
        expect(component.messageNameRecords[address1]).toEqual('myname.eth')
      })
      it('should NOT resolve the To field when there is NOT a resolvable name', () => {
        component.currentMessage["headers"]["to"] = mcAddress2
        component.ngOnInit()
        expect(component.messageNameRecords[address2]).toEqual(undefined)
      })
      it('should resolve the From field when there is a resolvable name', () => {
        component.currentMessage["headers"]["from"] = mcAddress1
        component.ngOnInit()
        expect(component.messageNameRecords[address1]).toEqual('myname.eth')
      })
      it('should NOT resolve the From field when there is NOT a resolvable name', () => {
        component.currentMessage["headers"]["from"] = mcAddress2
        component.ngOnInit()
        expect(component.messageNameRecords[address2]).toEqual(undefined)
      })
    });
  });

  describe('getViewForContentType', () => {
    it('should call getViewForContentType when the content-type is plaintext ', () => {
      spyOn(component, 'getViewForContentType')

      component.currentMessage["headers"]["content-type"] = 'text/plain; charset="UTF-8"'
      component.ngOnInit()
      expect(component.getViewForContentType).toHaveBeenCalled()
    })

    it('should call getViewForContentType when the content-type is text/plain; charset="UTF-8"', () => {
      spyOn(component, 'getViewForContentType')

      component.currentMessage["headers"]["content-type"] = 'text/plain; charset="UTF-8"'
      component.ngOnInit()
      expect(component.getViewForContentType).toHaveBeenCalled()
    })

    it('should call getViewForContentType when the content-type is unknown', () => {
      spyOn(component, 'getViewForContentType')

      component.currentMessage["headers"]["content-type"] = 'unknown'
      component.ngOnInit()
      expect(component.getViewForContentType).toHaveBeenCalled()
    })
  })

  describe('addMessageText', () => {
    it('should call addMessageText when the content-type is plaintext ', () => {
      spyOn(component, 'addMessageText')

      component.currentMessage["headers"]["content-type"] = 'text/plain; charset="UTF-8"'
      component.ngOnInit()
      expect(component.addMessageText).toHaveBeenCalled()
    })

    it('should NOT call addMessageText when the content-type is text/html; charset="UTF-8" ', () => {
      spyOn(component, 'addMessageText')

      component.currentMessage["headers"]["content-type"] = 'text/html; charset="UTF-8"'
      component.ngOnInit()
      expect(component.addMessageText).not.toHaveBeenCalled()
    })

    it('should call addMessageText when the content-type is unknown ', () => {
      spyOn(component, 'addMessageText')

      component.currentMessage["headers"]["content-type"] = 'unknown'
      component.ngOnInit()
      expect(component.addMessageText).toHaveBeenCalled()
    })

  })
  describe('addMessageIframe', () => {
    it('should NOT call addMessageIframe when the content-type is plaintext ', () => {
      spyOn(component, 'addMessageIframe')

      component.currentMessage["headers"]["content-type"] = 'text/plain; charset="UTF-8"'
      component.ngOnInit()
      expect(component.addMessageIframe).not.toHaveBeenCalled()
    })

    it('should call addMessageIframe when the content-type is text/html; charset="UTF-8" ', () => {
      spyOn(component, 'addMessageIframe')

      component.currentMessage["headers"]["content-type"] = 'text/html; charset="UTF-8"'
      component.ngOnInit()
      expect(component.addMessageIframe).toHaveBeenCalled()
    })

    it('should NOT call addMessageIframe when the content-type is unknown ', () => {
      spyOn(component, 'addMessageIframe')

      component.currentMessage["headers"]["content-type"] = 'unknown'
      component.ngOnInit()
      expect(component.addMessageIframe).not.toHaveBeenCalled()
    })

  })


});
