import { TestBed } from '@angular/core/testing';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { ProtocolsService } from '../../mailchain/protocols/protocols.service';
import { ProtocolsServiceStub } from '../../mailchain/protocols/protocols.service.stub';

import { LocalStorageNameserviceService } from './local-storage-nameservice.service';

describe('LocalStorageNameserviceService', () => {
  let localStorageNameserviceService: LocalStorageNameserviceService;
  let mailchainTestService: MailchainTestService;
  let protocolsService: ProtocolsService;

MailchainTestService
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageNameserviceService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
      ]
    });

    mailchainTestService = TestBed.get(MailchainTestService);
    localStorageNameserviceService = TestBed.get(LocalStorageNameserviceService);
    protocolsService = TestBed.get(ProtocolsService)

  });

  afterEach(() => {
    sessionStorage.clear();
  })
  it('should be created', () => {
    const service: LocalStorageNameserviceService = TestBed.get(LocalStorageNameserviceService);
    expect(service).toBeTruthy();
  });

  describe('getCurrentNameserviceAddressEnabled', () => {
    it('should get the current nameservice address enabled status when "true"', async () => {
      sessionStorage.setItem('currentNameserviceAddressEnabled', "true");
      expect(await localStorageNameserviceService.getCurrentNameserviceAddressEnabled()).toEqual("true");
    });
    it('should get the current nameservice address enabled status when "false"', async () => {
      sessionStorage.setItem('currentNameserviceAddressEnabled', "false");
      expect(await localStorageNameserviceService.getCurrentNameserviceAddressEnabled()).toEqual("false");
    });
    it('should look up the current nameservice address enabled status from protocols endpoint if not defined, expecting `true` (ethereum)', async () => {
      sessionStorage.removeItem('currentNameserviceAddressEnabled');
      sessionStorage.setItem('currentProtocol', 'ethereum')
      sessionStorage.setItem('currentNetwork', 'mainnet')
      spyOn(protocolsService, 'getProtocols').and.returnValue(mailchainTestService.protocolsServerResponse())

      expect(await localStorageNameserviceService.getCurrentNameserviceAddressEnabled()).toEqual("true");
    });
    it('should look up the current nameservice address enabled status from protocols endpoint if not defined, expecting `false` (substrate)', async () => {
      sessionStorage.removeItem('currentNameserviceAddressEnabled');
      sessionStorage.setItem('currentProtocol', 'substrate')
      sessionStorage.setItem('currentNetwork', 'edgeware-mainnet')
      spyOn(protocolsService, 'getProtocols').and.returnValue(mailchainTestService.protocolsServerResponse())

      expect(await localStorageNameserviceService.getCurrentNameserviceAddressEnabled()).toEqual("false");
    });

  });
  describe('setCurrentNameserviceAddressEnabled', () => {
    it('should set the current nameservice address enabled status to "true" when `"true"`', async () => {
      localStorageNameserviceService.setCurrentNameserviceAddressEnabled("true")
      expect(await localStorageNameserviceService.getCurrentNameserviceAddressEnabled()).toEqual("true");
    });
    it('should set the current nameservice address enabled status to "false" if not "true"', async () => {
      localStorageNameserviceService.setCurrentNameserviceAddressEnabled("false")
      expect(await localStorageNameserviceService.getCurrentNameserviceAddressEnabled()).toEqual("false");
    });
  });

});
