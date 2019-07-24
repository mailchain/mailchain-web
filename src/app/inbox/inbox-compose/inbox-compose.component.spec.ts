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

describe('InboxComposeComponent', () => {
  let component: InboxComposeComponent;
  let fixture: ComponentFixture<InboxComposeComponent>;
  let mailchainTestService: MailchainTestService
  let publicKeyService: PublicKeyService
  let sendService : SendService
  let mailchainService: MailchainService

  const currentAccount = '0x0123456789012345678901234567890123456789';
  const currentAccount2 = '0x0123456789abcdef0123456789abcdef01234567';
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

      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule
      ] 
    })
    .compileComponents();
    mailchainTestService = TestBed.get(MailchainTestService);
    publicKeyService = TestBed.get(PublicKeyService);
    sendService = TestBed.get(SendService);
    mailchainService = TestBed.get(MailchainService);

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

      describe('when composing a reply', () => {
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

        it('should initialize the model "body" field with the original message field', async() => {
        let response = "\r\n\r\n>From: <0x0123456789012345678901234567890123456789@testnet.ethereum>\r\n>Date: 2019-06-07T14:53:36Z\r\n>To: <0x0123456789abcdef0123456789abcdef01234567@testnet.ethereum>\r\n>Subject: Re: Mailchain Test!\r\n>\r\n>A body"

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
  });
  
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
        return of({"public_key": '1234567890abcd'})
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
      expect(mailchainService.generateMail).toHaveBeenCalledWith(mail)

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


});
