import { TestBed } from '@angular/core/testing';

import { LocalStorageProtocolService } from './local-storage-protocol.service';
import { HttpClientModule } from '@angular/common/http';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { of } from 'rxjs';
import { ProtocolsService } from '../../mailchain/protocols/protocols.service';
import { ProtocolsServiceStub } from '../../mailchain/protocols/protocols.service.stub';

describe('LocalStorageProtocolService', () => {
  let localStorageProtocolService: LocalStorageProtocolService;
  let mailchainTestService: MailchainTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageProtocolService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
      ],
      imports: [HttpClientModule]
    });

    localStorageProtocolService = TestBed.inject(LocalStorageProtocolService);
    mailchainTestService = TestBed.inject(MailchainTestService);

  });

  afterEach(() => {
    sessionStorage.clear();
  })

  it('should be created', () => {
    expect(localStorageProtocolService).toBeTruthy();
  });

  describe('getCurrentProtocol', () => {
    it('should retrieve the currentProtocol when NO value is stored', async () => {
      expect(await localStorageProtocolService.getCurrentProtocol()).toEqual(mailchainTestService.protocolsServerResponse()["protocols"][0]["name"])
    });

    it('should retrieve the currentProtocol when a value is stored', async () => {
      sessionStorage.setItem('currentProtocol', 'newChain');
      expect(await localStorageProtocolService.getCurrentProtocol()).toEqual('newChain')
    });
  });

  describe('setCurrentProtocol', () => {
    it('should set the current protocol', async () => {
      expect(await localStorageProtocolService.getCurrentProtocol()).not.toEqual('newerChain')
      localStorageProtocolService.setCurrentProtocol('newerChain')
      expect(await localStorageProtocolService.getCurrentProtocol()).toEqual('newerChain')
    });
  });
});
