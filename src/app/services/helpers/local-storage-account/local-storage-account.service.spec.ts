import { TestBed } from '@angular/core/testing';

import { LocalStorageAccountService } from './local-storage-account.service';
import { HttpClientModule } from '@angular/common/http';

describe('LocalStorageAccountService', () => {
  let localStorageAccountService: LocalStorageAccountService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageAccountService,
      ],
      imports: [HttpClientModule]
    });

    localStorageAccountService = TestBed.get(LocalStorageAccountService);
  });

  it('should be created', () => {
    expect(localStorageAccountService).toBeTruthy();
  });
});
