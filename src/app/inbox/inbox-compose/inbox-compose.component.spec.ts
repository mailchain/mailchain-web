import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxComposeComponent } from './inbox-compose.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/services/helpers/http-helpers/http-helpers.service';
import { Mail } from 'src/app/models/mail';
import { AddressesService } from 'src/app/services/mailchain/addresses/addresses.service';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { of } from 'rxjs';
import { PublicKeyService } from 'src/app/services/mailchain/public-key/public-key.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SendService } from 'src/app/services/mailchain/messages/send.service';
import { OutboundMail } from 'src/app/models/outbound-mail';
import { MailchainService } from 'src/app/services/mailchain/mailchain.service';
import { NameserviceService } from 'src/app/services/mailchain/nameservice/nameservice.service';

import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalConnectivityErrorComponent } from '../../modals/modal-connectivity-error/modal-connectivity-error.component';
import { NgModule } from '@angular/core';
import { CKEditorModule, CKEditorComponent } from '@ckeditor/ckeditor5-angular';


// Workaround:
// Error from entryComponents not present in TestBed. Fix ref: https://stackoverflow.com/a/42399718
@NgModule({
  declarations: [ModalConnectivityErrorComponent],
  entryComponents: [ModalConnectivityErrorComponent]
})
export class FakeModalConnectivityErrorModule {}
// End workaround

describe('InboxComposeComponent', () => {
  let component: InboxComposeComponent;
  let fixture: ComponentFixture<InboxComposeComponent>;
  let mailchainTestService: MailchainTestService
  let publicKeyService: PublicKeyService
  let sendService : SendService
  let mailchainService: MailchainService
  let nameserviceService: NameserviceService

  const currentAccount = '0x0123456789012345678901234567890123456789';
  const currentAccount2 = '0x0123456789abcdef0123456789abcdef01234567';
  const ensName = 'mailchain.eth';
  const addresses = [currentAccount, currentAccount2];

  class AddressesServiceStub {
    getAddresses(){
      return addresses
    }
  }
  class PublicKeyServiceStub {
    getPublicKeyFromAddress(publicAddress, network) {       
      return of(['1234567890'])
    }
  }
  class SendServiceStub {
    sendMail(outboundMail: OutboundMail, network: string){
      return of([])
    }
  }
  class NameserviceServiceStub {
    resolveName(value) {      
      return of(
        { body: { address: currentAccount } }
      )
    }
  }
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxComposeComponent,
      ],
      providers: [
        HttpHelpersService,
        MailchainService,
        { provide: AddressesService, useClass: AddressesServiceStub },
        { provide: PublicKeyService, useClass: PublicKeyServiceStub },
        { provide: SendService, useClass: SendServiceStub },
        { provide: NameserviceService, useClass: NameserviceServiceStub },

      ],
      imports: [
        CKEditorModule,
        FakeModalConnectivityErrorModule,
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        RouterTestingModule,
      ] 
    })
    .compileComponents();
    mailchainTestService = TestBed.get(MailchainTestService);
    publicKeyService = TestBed.get(PublicKeyService);
    sendService = TestBed.get(SendService);
    mailchainService = TestBed.get(MailchainService);
    nameserviceService = TestBed.get(NameserviceService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('initMail', () => {
      
      it('should start with an empty Mail object', () => {
        expect(component.model).toEqual(new Mail)
      })

      describe('when composing a new message', () => {
        it('should initialize an empty model "to" field', async() => {
          await component.ngOnInit();
          expect(component.model.to).toBe('')
        })  

        it('should initialize the model "from" field with currentAccount', async() => {
          component.currentAccount = currentAccount
          await component.ngOnInit();
          expect(component.model.from).toBe(currentAccount)
          
          component.currentAccount = currentAccount2
          await component.ngOnInit();
          fixture.detectChanges()
          expect(component.model.from).toBe(currentAccount2)
        })  

        it('should initialize an empty model "subject" field', async() => {
          await component.ngOnInit();
          expect(component.model.subject).toBe('')
        })  

        it('should initialize an empty model "body" field', async() => {
          await component.ngOnInit();
          expect(component.model.body).toBe('')
        })  
      });

      describe('when composing a plaintext reply', () => {
        beforeEach(()=>{
          component.currentMessage = mailchainTestService.inboundMessage();
        })

        it('should initialize the model "from" field with the recipient address', async() => {
          await component.ngOnInit();
          expect(component.model.from).toBe('0x0123456789abcdef0123456789abcdef01234567')
        })  

        it('should initialize the model "subject" field with the original message field + a prefix of "Re: "', async() => {
          await component.ngOnInit();
          expect(component.model.subject).toBe('Re: Mailchain Test!')
        })  

        it('should not re-initialize the model "subject" field with an extra prefix of "Re: "', async() => {
          component.currentMessage.subject = "Re: Mailchain Test!"
          await component.ngOnInit();
          expect(component.model.subject).toBe('Re: Mailchain Test!')
        })  

        it('should initialize the model "body" field with the original message field', async() => {
        let response = "\r\n\r\n>From: <0x0123456789012345678901234567890123456789@testnet.ethereum>\r\n>Date: 2019-06-07T14:53:36Z\r\n>To: <0x0123456789abcdef0123456789abcdef01234567@testnet.ethereum>\r\n>Subject: Mailchain Test!\r\n>\r\n>A body"

          await component.ngOnInit();
          expect(JSON.stringify(component.model.body)).toBe(JSON.stringify(response))
        })  
      });
      
      describe('when composing an html reply', () => {
        beforeEach(()=>{
          component.currentMessage = mailchainTestService.inboundMessage();
          component.currentMessage.headers["content-type"] = "text/html; charset=\"UTF-8\""
        })

        it('should initialize the model "from" field with the recipient address', async() => {
          await component.ngOnInit();
          expect(component.model.from).toBe('0x0123456789abcdef0123456789abcdef01234567')
        })  

        it('should initialize the model "subject" field with the original message field + a prefix of "Re: "', async() => {
          await component.ngOnInit();
          expect(component.model.subject).toBe('Re: Mailchain Test!')
        })  

        it('should not re-initialize the model "subject" field with an extra prefix of "Re: "', async() => {
          component.currentMessage.subject = "Re: Mailchain Test!"
          await component.ngOnInit();
          expect(component.model.subject).toBe('Re: Mailchain Test!')
        })  

        it('should initialize the model "body" field with the original message field and wrap the body in a `blockquote`', async() => {
        let response = "<p></p><p><strong>From:</strong> <0x0123456789012345678901234567890123456789@testnet.ethereum><br><strong>Date:</strong> 2019-06-07T14:53:36Z<br><strong>To:</strong> <0x0123456789abcdef0123456789abcdef01234567@testnet.ethereum><br><strong>Subject:</strong> Mailchain Test!</p><blockquote>A body<br></blockquote>"

          await component.ngOnInit();
          expect(JSON.stringify(component.model.body)).toBe(JSON.stringify(response))
        })

      });
      
      describe('setFromAddressList', () => {
        it('should set the fromAddresses', async() => {
          expect(component.fromAddresses).toEqual([])
          await component.ngOnInit();
          expect(component.fromAddresses).toEqual(addresses)

        })  
      });
    });

    describe('initEditor', () => {
      it('should initialize the editor', async()=> {
        await component.ngOnInit();
        expect(component.editorComponent).toBeTruthy();
      })
    });
  });

  describe('recipientResolve', () => {
    it('should clear the recipientLoadingIcon if the event target value is empty', ()=>{
      let event = {target: { value: "" } }
      spyOn(component,'setRecipientLoadingIcon').and.callThrough()
      
      component.recipientResolve(event)
      expect(component.setRecipientLoadingIcon).toHaveBeenCalledWith('clear')
      expect(component.recipientLoadingIcon).toEqual("")
    })
    it('should clear the setRecipientLoadingText if the event target value is empty', ()=>{
      let event = {target: { value: "" } }
      spyOn(component,'setRecipientLoadingText').and.callThrough()
      
      component.recipientResolve(event)
      expect(component.setRecipientLoadingText).toHaveBeenCalled()
      expect(component.recipientLoadingText).toEqual("")
    })
    it('should reset the model.to field if the event target value is empty', ()=>{
      let event = {target: { value: "" } }
      spyOn(component,'resetModelToField').and.callThrough()
      
      component.recipientResolve(event)
      expect(component.resetModelToField).toHaveBeenCalled()
      expect(component.model.to).toEqual("")
    })

    it('should set the recipientLoadingIcon to loading if the event target value is different to the currentRecipientValue', ()=>{
      let event = {target: { value: "alice.eth" } }
      spyOn(component,'setRecipientLoadingIcon').and.callThrough()
      component.currentRecipientValue = "bob.eth"
      
      component.recipientResolve(event)
      expect(component.setRecipientLoadingIcon).toHaveBeenCalledWith('loading')
      expect(component.recipientLoadingIcon).not.toEqual("")
    })
    it('should clear the setRecipientLoadingText if the event target value is empty', ()=>{
      let event = {target: { value: "alice.eth" } }
      spyOn(component,'setRecipientLoadingText').and.callThrough()
      component.currentRecipientValue = "bob.eth"
      
      component.recipientResolve(event)
      expect(component.setRecipientLoadingText).toHaveBeenCalled()
      expect(component.recipientLoadingText).toEqual("")
    })
    it('should reset the model.to field if the event target value is empty', ()=>{
      let event = {target: { value: "alice.eth" } }
      spyOn(component,'resetModelToField').and.callThrough()
      component.currentRecipientValue = "bob.eth"
      
      component.recipientResolve(event)
      expect(component.resetModelToField).toHaveBeenCalled()
      expect(component.model.to).toEqual("")
    })
    it('should set the currentRecipientValue to event target value when given a name-like value', ()=>{
      let event = {target: { value: "alice.eth" } }

      component.recipientResolve(event)
      expect(component.currentRecipientValue).toEqual("alice.eth")
    })
    xit('should call the resolveAddress thru the private recipientAddressChanged subscription next function with the event.target.value', ()=>{
      let event = {target: { value: "alice.eth" } }
      spyOn(component,'resolveAddress').and.callThrough()
      // todo: track recipientAddressChanged call
    })
  })
  
  describe('setRecipientLoadingIcon', () => {
    it('should set the recipientLoadingIcon for variable: "loading"', ()=>{
      component.recipientLoadingIcon = ""
      component.setRecipientLoadingIcon('loading')
      expect(component.recipientLoadingIcon).toBe ("fa fa-spinner fa-pulse")
    })
    it('should set the recipientLoadingIcon for variable: "valid"', ()=>{
      component.recipientLoadingIcon = ""
      component.setRecipientLoadingIcon('valid')
      expect(component.recipientLoadingIcon).toBe ("fa fa-check-circle text-success")
    })
    it('should set the recipientLoadingIcon for variable: "invalid"', ()=>{
      component.recipientLoadingIcon = ""
      component.setRecipientLoadingIcon('invalid')
      expect(component.recipientLoadingIcon).toBe ("fa fa-times-circle text-danger")
    })
    it('should set the recipientLoadingIcon for variable: "clear"', ()=>{
      component.recipientLoadingIcon = ""
      component.setRecipientLoadingIcon('clear')
      expect(component.recipientLoadingIcon).toBe ("")
    })
  })
  
  describe('setRecipientLoadingText', () => {
    it('should set the text to the input value', ()=>{
      component.setRecipientLoadingText("My message")
      expect(component.recipientLoadingText).toEqual("My message")
    })
    it('should set the text to empty when no value is provided', ()=>{
      component.setRecipientLoadingText()
      expect(component.recipientLoadingText).toEqual("")
    })
  })
  
  describe('setupRecipientAddressLookupSubscription', () => {
    xit('should ', ()=>{
      // todo: needs help
    })
  })
  
  describe('resetModelToField', () => {
    it('should reset the model.to field', ()=>{
      component.model.to = "0x0000000"
      component.resetModelToField()
      expect(component.model.to).toEqual("")
    })
  })
  
  describe('resolveAddress', () => {
    it('should call nameserviceService.resolveName if given a name-like value', ()=>{
      spyOn(nameserviceService,'resolveName').and.callThrough()
      component.resolveAddress(ensName)
      expect(nameserviceService.resolveName).toHaveBeenCalled()

    })
    it('should call nameserviceService.resolveName with params for protocol, network & name-like value', ()=>{
      spyOn(nameserviceService,'resolveName').and.callThrough()
      component.resolveAddress(ensName)
      expect(nameserviceService.resolveName).toHaveBeenCalledWith(
        component.currentProtocol,
        component.currentNetwork,
        ensName
      )
    })
    it('should return an observable with body containing address hash if given a name-like value', async()=>{
      let obs = await component.resolveAddress(ensName)
      let expectedBody = {address: currentAccount}
      obs.subscribe(res => {
        expect(res['body']).toEqual(expectedBody)
      })
    })
    it('should return an observable with body containing address hash if given an address-like value', async()=>{
      let obs = await component.resolveAddress(currentAccount)
      let expectedBody = {address: currentAccount}
      obs.subscribe(res => {
        expect(res['body']).toEqual(expectedBody)
      })
    })
    it('should return an observable with body containing empty address hash if given a value that is not name-like or address-like', async()=>{
      let obs = await component.resolveAddress('string')
      let expectedBody = {address: ''}
      obs.subscribe(res => {
        expect(res['body']).toEqual(expectedBody)
      })
    })
  })
  
  describe('returnToInboxMessages', () => {
    it('should call goToInboxMessages.emit() to change the view to  "messages"', () => {
      spyOn(component.goToInboxMessages,'emit')

      component.returnToInboxMessages()
      expect(component.goToInboxMessages.emit).toHaveBeenCalledWith('')
    })  
  });
  describe('returnToMessage', () => {
    it('should call goToInboxMessages.emit() to change the view to  "messages" if there is no currentMessage', () => {
      spyOn(component.goToInboxMessages,'emit')

      component.returnToMessage()
      expect(component.goToInboxMessages.emit).toHaveBeenCalledWith('')
    })  
    it('should call openMessage.emit(`currentMessage`) to change the view to  "messages" if there is a currentMessage', () => {
      spyOn(component.openMessage,'emit')
      component.currentMessage = mailchainTestService.inboundMessage();

      component.returnToMessage()
      expect(component.openMessage.emit).toHaveBeenCalledWith(component.currentMessage)
    })  
  });
  describe('supressEnterPropagation', () => {
    it('should stop event propagation when Enter is pressed', () => {
      let $event = new KeyboardEvent('keydown', {'code': 'Enter'})
      spyOn($event,'stopPropagation')
      component.supressEnterPropagation($event)
      expect($event.stopPropagation).toHaveBeenCalled()
    })  
  });

  describe('onSubmit', () => {
    let mail = new Mail
    mail.to = ''
    mail.from = ''
    mail.subject = ''
    mail.body = ''
    mail.publicKey = "1234567890abcd"

    let outboundMail = new OutboundMail
    outboundMail.message = {
      body: 'This is a test message',
      headers: {
        "from": '0x0123456789abcdef0123456789abcdef01234567',
        "reply-to": '0x0123456789abcdef0123456789abcdef01234567',
        "to": '0x0123456789012345678901234567890123456789'
      },
      "public-key": "1234567890abcd",
      subject: 'Test Message'
    }

    beforeEach(()=>{
      component.model.to = currentAccount
      component.model.from = currentAccount2
      component.model.subject = "Test Message"
      component.model.body = "This is a test message"
      component.currentNetwork = 'testnet'

      spyOn(publicKeyService,"getPublicKeyFromAddress").and.callFake( ()=>{
        return of({"body":{
          "public_key": '1234567890abcd'}
        })
      });      
      spyOn(sendService,"sendMail").and.callFake( ()=>{
        return of(['ok'])
      });
      
      spyOn(mailchainService,"generateMail").and.callFake(() => {
        return outboundMail
      })
    })

    it('should get the public key for an address', async() => {
      component.onSubmit();

      expect(publicKeyService.getPublicKeyFromAddress).toHaveBeenCalledWith(currentAccount,'testnet')
    })  

    it('should send a message using the sendService', async() => {
      
      component.onSubmit();
      expect(sendService.sendMail).toHaveBeenCalledWith(outboundMail,'testnet')
    })  

    it('should generate a message', () => {
      
      component.onSubmit();
      expect(mailchainService.generateMail).toHaveBeenCalledWith(mail, 'html')

    })  
    
    it('should reinitialize the message after sending', () => {

      component.onSubmit();
      expect(component.model).toEqual(mail)
    })  
    it('should call returnToInboxMessages after sending', () => {
      spyOn(component,"returnToInboxMessages")
      component.onSubmit();
      expect(component.returnToInboxMessages).toHaveBeenCalled()
    })  
    xit('should validate form fields', () => {
      // expect()
    })  
    xit('should handle public key lookup failure', () => {
      // expect()
    })  
  });

  describe('handleErrorOnPage', () => {
    it('should show error on page', () => {
      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      let title = "Error Title"
      let msg = "Error Message"

      component.handleErrorOnPage(title, msg)      
      
      expect(component.errorTitle).toEqual(title)
      expect(component.errorMessage).toEqual(msg)

      expect(component.modalConnectivityError.content["errorTitle"]).toEqual(title)
      expect(component.modalConnectivityError.content["errorMessage"]).toEqual(msg)

    });

    it('should only show error on page if no other error is present', () => {
      let origTitle = "Existing error"
      let origMsg = "Error is already in view"
      let title = "Error Title"
      let msg = "Error Message"
      
      component.errorTitle = origTitle
      component.errorMessage = origMsg
      
      component.handleErrorOnPage(title, msg)
            
      expect(component.errorTitle).toEqual(origTitle)
      expect(component.errorMessage).toEqual(origMsg)
      
    });
  });

  describe('convertToPlainText', () => {
    it('should convert html to plain text when confirm box is OK', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(document, 'getElementsByClassName').and.returnValue([ {"innerText": "Replying to a message\n\nFrom: <0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6@ropsten.ethereum>\nDate: 2019-12-05T21:17:04Z\nTo: <0x92d8f10248c6a3953cc3692a894655ad05d61efb@ropsten.ethereum>\nSubject: Fw: another message\n\nSending a message"} ]);
      
      component.convertToPlainText()

      expect(window.confirm).toHaveBeenCalled()
      expect(component.inputContentType).toEqual('plaintext')
      expect(component.model.body).toBe("Replying to a message\n\nFrom: <0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6@ropsten.ethereum>\nDate: 2019-12-05T21:17:04Z\nTo: <0x92d8f10248c6a3953cc3692a894655ad05d61efb@ropsten.ethereum>\nSubject: Fw: another message\n\nSending a message")

    })
    it('should not convert html to plain text when confirm box is cancel', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.convertToPlainText()

      expect(window.confirm).toHaveBeenCalled()
      expect(component.inputContentType).toEqual('html')
    })
  });

});
