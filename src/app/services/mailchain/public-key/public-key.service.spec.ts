import { TestBed } from '@angular/core/testing';

import { PublicKeyService } from './public-key.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';
import { ProtocolsService } from '../protocols/protocols.service';
import { ProtocolsServiceStub } from '../protocols/protocols.service.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicKeyServiceStub } from './public-key.service.stub';
import { of } from 'rxjs';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

describe('PublicKeyService', () => {
  let publicKeyService: PublicKeyService;
  let mailchainTestService: MailchainTestService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // PublicKeyService,
        LocalStorageProtocolService,
        HttpHelpersService,
        PublicKeyService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
      ],
      imports: [HttpClientTestingModule]
    });

    publicKeyService = TestBed.get(PublicKeyService);
    mailchainTestService = TestBed.get(MailchainTestService);
  });

  it('should be created', () => {
    expect(publicKeyService).toBeTruthy();
  });

  describe('getPublicKeyFromAddress', () => {
    beforeEach(() => {
      spyOn(publicKeyService, 'getPublicKeyFromAddress').and.returnValue(
        of(mailchainTestService.publicKeyHexZeroXResponse())
      )
    });
    it('should return `public-key`', async () => {
      let result
      await publicKeyService.getPublicKeyFromAddress("0x0123456789abcdef0123456789abcdef01234567", "ropsten").subscribe(res => {
        result = res["body"]
      })
      expect(result["public-key"]).toBe("0x1234567890")
      expect(publicKeyService.getPublicKeyFromAddress).toHaveBeenCalled()
    });
    it('should return `public-key-encoding`', async () => {
      let result
      await publicKeyService.getPublicKeyFromAddress("0x0123456789abcdef0123456789abcdef01234567", "ropsten").subscribe(res => {
        result = res["body"]
      })
      expect(result["public-key-encoding"]).toBe("hex/0x-prefix")
      expect(publicKeyService.getPublicKeyFromAddress).toHaveBeenCalled()
    });
    it('should return `public-key-kind`', async () => {
      let result
      await publicKeyService.getPublicKeyFromAddress("0x0123456789abcdef0123456789abcdef01234567", "ropsten").subscribe(res => {
        result = res["body"]
      })
      expect(result["public-key-kind"]).toBe("secp256k1")
      expect(publicKeyService.getPublicKeyFromAddress).toHaveBeenCalled()
    });
    it('should return `supported-encryption-types`', async () => {
      let result
      await publicKeyService.getPublicKeyFromAddress("0x0123456789abcdef0123456789abcdef01234567", "ropsten").subscribe(res => {
        result = res["body"]
      })
      expect(result["supported-encryption-types"]).toEqual(["aes256cbc", "noop"])
      expect(publicKeyService.getPublicKeyFromAddress).toHaveBeenCalled()
    });

  });
});
