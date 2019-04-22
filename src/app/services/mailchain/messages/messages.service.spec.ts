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
});
