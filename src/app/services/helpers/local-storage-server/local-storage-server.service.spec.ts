import { TestBed } from '@angular/core/testing';

import { LocalStorageServerService } from './local-storage-server.service';
import { HttpClientModule } from '@angular/common/http';

describe('LocalStorageServerService', () => {
  let localStorageServerService: LocalStorageServerService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageServerService,
      ],
      imports: [HttpClientModule]
    });

    localStorageServerService = TestBed.get(LocalStorageServerService);
  });

  it('should be created', () => {
    expect(localStorageServerService).toBeTruthy();
  });
});
