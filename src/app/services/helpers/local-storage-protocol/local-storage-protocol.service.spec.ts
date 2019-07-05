import { TestBed } from '@angular/core/testing';

import { LocalStorageProtocolService } from './local-storage-protocol.service';
import { HttpClientModule } from '@angular/common/http';
import { applicationApiConfig } from 'src/environments/environment';

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

  afterEach(() => {
    sessionStorage.clear();
  })

  it('should be created', () => {
    expect(localStorageProtocolService).toBeTruthy();
  });

  describe('getCurrentProtocol', () => {
    it('should retrieve the currentProtocol when NO value is stored', () => {
      expect(localStorageProtocolService.getCurrentProtocol()).toEqual(applicationApiConfig.protocols[0])
    });

    it('should retrieve the currentProtocol when a value is stored', () => {
      sessionStorage.setItem('currentProtocol', 'newChain');
      expect(localStorageProtocolService.getCurrentProtocol()).toEqual('newChain')
    });
  });

  describe('setCurrentProtocol', () => {
    it('should set the current protocol', () => {
      expect(localStorageProtocolService.getCurrentProtocol()).not.toEqual('newerChain')
      localStorageProtocolService.setCurrentProtocol('newerChain')
      expect(localStorageProtocolService.getCurrentProtocol()).toEqual('newerChain')
    });
  });
});
