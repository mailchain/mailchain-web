import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { HttpClientModule } from '@angular/common/http';

describe('LocalStorageService', () => {
  let localStorageService: LocalStorageService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
      ],
      imports: [HttpClientModule]
    });

    localStorageService = TestBed.get(LocalStorageService);
  });

  it('should be created', () => {
    expect(localStorageService).toBeTruthy();
  });
});
