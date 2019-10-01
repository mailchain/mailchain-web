import { TestBed } from '@angular/core/testing';

import { PublicKeyService } from './public-key.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';

describe('PublicKeyService', () => {
  let publicKeyService: PublicKeyService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PublicKeyService,
        LocalStorageProtocolService,
        HttpHelpersService
      ],
      imports: [HttpClientModule]
    });

    publicKeyService = TestBed.get(PublicKeyService);
  });

  it('should be created', () => {
    expect(publicKeyService).toBeTruthy();
  });
});
