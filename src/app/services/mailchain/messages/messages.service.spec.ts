import { TestBed } from '@angular/core/testing';

import { MessagesService } from './messages.service';
import { HttpClientModule } from '@angular/common/http';

describe('MessagesService', () => {
  let messagesService: MessagesService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessagesService,
      ],
      imports: [HttpClientModule]
    });

    messagesService = TestBed.get(MessagesService);
  });

  it('should be created', () => {
    expect(messagesService).toBeTruthy();
  });

  describe('initServerDetails', () => {
    it('should initialize the url', () => {    
      let messagesService: MessagesService = TestBed.get(MessagesService)
      expect(messagesService['url']).toEqual('http://127.0.0.1:8080/api')
    });
    
    it('should initialize the protocol', () => {    
      let messagesService: MessagesService = TestBed.get(MessagesService)
      expect(messagesService['protocol']).toEqual('ethereum')
    });
  });

  describe('getMessages', () => {
    xit('should initialize the protocol', () => {
      //TODO: return messages stub
    });


  });
});
