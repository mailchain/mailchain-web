import { TestBed } from '@angular/core/testing';

import { LocalStorageProtocolService } from './local-storage-protocol.service';
import { HttpClientModule } from '@angular/common/http';

describe('LocalStorageProtocolService', () => {
  let localStorageProtocolService: LocalStorageProtocolService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageProtocolService,
      ],
      imports: [HttpClientModule]
    });

    localStorageProtocolService = TestBed.get(LocalStorageProtocolService);
  });

  it('should be created', () => {
    expect(localStorageProtocolService).toBeTruthy();
  });
});
