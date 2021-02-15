import { TestBed } from '@angular/core/testing';

import { LocalStorageServerService } from './local-storage-server.service';
import { HttpClientModule } from '@angular/common/http';
import { applicationApiConfig } from 'src/environments/environment';

describe('LocalStorageServerService', () => {
  let localStorageServerService: LocalStorageServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageServerService,
      ],
      imports: [HttpClientModule]
    });

    localStorageServerService = TestBed.inject(LocalStorageServerService);
  });

  afterEach(() => {
    sessionStorage.clear();
  })

  it('should be created', () => {
    expect(localStorageServerService).toBeTruthy();
  });

  describe('getCurrentNetwork', () => {
    it('should retrieve the current network when NO value is stored', () => {
      expect(localStorageServerService.getCurrentNetwork()).toEqual(applicationApiConfig.networks[0]);
    });

    it('should retrieve the current network when a value is stored', () => {
      sessionStorage.setItem('currentNetwork', 'ropsten-1010');
      expect(localStorageServerService.getCurrentNetwork()).toEqual("ropsten-1010")
    });
  });

  describe('setCurrentNetwork', () => {
    it('should set the current network', () => {
      expect(localStorageServerService.getCurrentNetwork()).not.toEqual("ropsten-9090")
      localStorageServerService.setCurrentNetwork('ropsten-9090')
      expect(localStorageServerService.getCurrentNetwork()).toEqual("ropsten-9090")
    });
  });

  describe('removeCurrentNetwork', () => {
    it('should remove the current network', () => {
      localStorageServerService.setCurrentNetwork('ropsten-7742')
      expect(localStorageServerService.getCurrentNetwork()).toEqual("ropsten-7742")
      localStorageServerService.removeCurrentNetwork()
      expect(localStorageServerService.getCurrentNetwork()).toEqual(applicationApiConfig.networks[0]);
    });
  });

  describe('getCurrentWebProtocol', () => {
    it('should get the current web protocol', () => {
      expect(localStorageServerService.getCurrentWebProtocol()).toEqual(applicationApiConfig.mailchainNodeBaseWebProtocol);
    });
  });
  describe('setCurrentWebProtocol', () => {
    it('should set the current web protocol', () => {
      expect(localStorageServerService.getCurrentWebProtocol()).not.toEqual('https-test');
      localStorageServerService.setCurrentWebProtocol('https-test')
      expect(localStorageServerService.getCurrentWebProtocol()).toEqual('https-test');

    });
  });

  describe('getCurrentHost', () => {
    it('should get the current host', () => {
      expect(localStorageServerService.getCurrentHost()).toEqual(applicationApiConfig.mailchainNodeBaseHost);
    });
  });
  describe('setCurrentHost', () => {
    it('should set the current host', () => {
      expect(localStorageServerService.getCurrentHost()).not.toEqual("example.com");
      localStorageServerService.setCurrentHost("example.com")
      expect(localStorageServerService.getCurrentHost()).toEqual("example.com");
    });
  });

  describe('getCurrentPort', () => {
    it('should get the current port', () => {
      expect(localStorageServerService.getCurrentPort()).toEqual(applicationApiConfig.mailchainNodeBasePort);
    });
  });
  describe('setCurrentPort', () => {
    it('should set the current port', () => {
      expect(localStorageServerService.getCurrentPort()).not.toEqual("8084");
      localStorageServerService.setCurrentPort("8084")
      expect(localStorageServerService.getCurrentPort()).toEqual("8084");
    });
  });

  describe('getCurrentServerDetails', () => {
    it('should set the current server details', () => {
      let url = `${applicationApiConfig.mailchainNodeBaseWebProtocol}://${applicationApiConfig.mailchainNodeBaseHost}:${applicationApiConfig.mailchainNodeBasePort}`

      expect(localStorageServerService.getCurrentServerDetails()).toEqual(url);

    });
  });

});
