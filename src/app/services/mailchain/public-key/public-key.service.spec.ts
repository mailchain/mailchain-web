import { TestBed } from '@angular/core/testing';

import { PublicKeyService } from './public-key.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';
import { ProtocolsService } from '../protocols/protocols.service';
import { ProtocolsServiceStub } from '../protocols/protocols.service.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicKeyServiceStub } from './public-key.service.stub';

describe('PublicKeyService', () => {
  let publicKeyService: PublicKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // PublicKeyService,
        LocalStorageProtocolService,
        HttpHelpersService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        { provide: PublicKeyService, useClass: PublicKeyServiceStub },
      ],
      imports: [HttpClientTestingModule]
    });

    publicKeyService = TestBed.get(PublicKeyService);
  });

  it('should be created', () => {
    expect(publicKeyService).toBeTruthy();
  });

  describe('getPublicKeyFromAddress', () => {
    it('should return `public-key`', async () => {
      let result
      await publicKeyService.getPublicKeyFromAddress("0x0123456789abcdef0123456789abcdef01234567", "ropsten").subscribe(res => {
        result = res["body"]
      })
      expect(result["public-key"]).toBe("0x1234567890")
    });
    it('should return `public-key-encoding`', async () => {
      let result
      await publicKeyService.getPublicKeyFromAddress("0x0123456789abcdef0123456789abcdef01234567", "ropsten").subscribe(res => {
        result = res["body"]
      })
      expect(result["public-key-encoding"]).toBe("hex/0x-prefix")
    });
    it('should return `public-key-kind`', async () => {
      let result
      await publicKeyService.getPublicKeyFromAddress("0x0123456789abcdef0123456789abcdef01234567", "ropsten").subscribe(res => {
        result = res["body"]
      })
      expect(result["public-key-kind"]).toBe("secp256k1")
    });
    it('should return `supported-encryption-types`', async () => {
      let result
      await publicKeyService.getPublicKeyFromAddress("0x0123456789abcdef0123456789abcdef01234567", "ropsten").subscribe(res => {
        result = res["body"]
      })
      expect(result["supported-encryption-types"]).toEqual(["aes256cbc", "noop"])
    });

  });
});
