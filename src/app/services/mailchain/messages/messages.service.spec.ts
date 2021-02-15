import { TestBed } from '@angular/core/testing';

import { MessagesService } from './messages.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { LocalStorageServerServiceStub } from '../../helpers/local-storage-server/local-storage-server.service.stub';

describe('MessagesService', () => {
  let messagesService: MessagesService;
  let mailchainTestService: MailchainTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessagesService,
        HttpHelpersService,
        { provide: LocalStorageServerService, useClass: LocalStorageServerServiceStub },
      ],
      imports: [HttpClientTestingModule]
    });

    messagesService = TestBed.inject(MessagesService);
    mailchainTestService = TestBed.inject(MailchainTestService);

  });

  it('should be created', () => {
    expect(messagesService).toBeTruthy();
  });

  describe('initServerDetails', () => {
    it('should initialize the url', () => {
      let messagesService: MessagesService = TestBed.inject(MessagesService)
      expect(messagesService['url']).toEqual('http://127.0.0.1:8080/api')
    });
  });

  describe('getMessages', () => {
    xit('should initialize the protocol', () => {
      //TODO: return messages stub
    });


  });
});
