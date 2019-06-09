import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
import { PublicKeyService } from '../services/mailchain/public-key/public-key.service';
import { MessagesService } from '../services/mailchain/messages/messages.service';
import { ReadService } from '../services/mailchain/messages/read.service';
import { of } from 'rxjs';
import { MailchainTestService } from '../test/test-helpers/mailchain-test.service';


describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let localStorageAccountService: LocalStorageAccountService
  let mailchainTestService: MailchainTestService

  const currentAccount = '0x0123456789012345678901234567890123456789';
  const currentAccount2 = '0x0123456789abcdef0123456789abcdef01234567';
  const currentNetwork = 'testnet';
  const currentWebProtocol = 'https';
  const currentHost = 'example.com';
  const currentPort = '8080';
  const addresses = [currentAccount, currentAccount2];
  
  class LocalStorageAccountServiceStub {
    getCurrentAccount(){
      return currentAccount
    }
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
      return currentNetwork
    }
    getCurrentServerDetails(){
      return `${currentWebProtocol}://${currentHost}:${currentPort}`

    }
  }
  class PublicKeyServiceStub {
    getPublicSenderAddresses(){
      return addresses
    }
  }
  // class ReadServiceStub {

  // }
  class MessagesServiceStub {    
    getMessages() {
      let messages = mailchainTestService.messagesResponse
      return of(messages)
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
        { provide: PublicKeyService, useClass: PublicKeyServiceStub },
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
  }));



  beforeEach(() => {
    
    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
