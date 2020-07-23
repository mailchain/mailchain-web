import { TestBed } from '@angular/core/testing';

import { PublicKeyService } from './public-key.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';
import { ProtocolsService } from '../protocols/protocols.service';
import { ProtocolsServiceStub } from '../protocols/protocols.service.stub';

describe('PublicKeyService', () => {
  let publicKeyService: PublicKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PublicKeyService,
        LocalStorageProtocolService,
        HttpHelpersService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
      ],
      imports: [HttpClientModule]
    });

    publicKeyService = TestBed.get(PublicKeyService);
  });

  it('should be created', () => {
    expect(publicKeyService).toBeTruthy();
  });
});
