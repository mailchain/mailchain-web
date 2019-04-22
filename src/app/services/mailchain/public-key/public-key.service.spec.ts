import { TestBed } from '@angular/core/testing';

import { PublicKeyService } from './public-key.service';
import { HttpClientModule } from '@angular/common/http';

describe('PublicKeyService', () => {
  let publicKeyService: PublicKeyService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PublicKeyService,
      ],
      imports: [HttpClientModule]
    });

    publicKeyService = TestBed.get(PublicKeyService);
  });

  it('should be created', () => {
    expect(publicKeyService).toBeTruthy();
  });
});
