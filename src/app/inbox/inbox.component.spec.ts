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
  let networkList: any

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
    networkList = mailchainTestService.networkList();
  }));
  
  beforeEach(() => {
    
    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should setNetworkList', () => {
    expect(fixture.componentInstance.networks).toEqual([]);
    fixture.componentInstance.setNetworkList()
    expect(fixture.componentInstance.networks).toEqual(networkList)
  });
});
