import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

import { ProtocolsService } from './protocols.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { of } from 'rxjs';

describe('ProtocolsService', () => {

  let protocolsService: ProtocolsService;
  let httpTestingController: HttpTestingController;
  let mailchainTestService: MailchainTestService;
  let serverResponse

  const desiredUrl = `http://127.0.0.1:8080/api/protocols`

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProtocolsService,
        HttpHelpersService,
      ],
      imports: [HttpClientTestingModule]
    });
    mailchainTestService = TestBed.inject(MailchainTestService);

    protocolsService = TestBed.inject(ProtocolsService);
    mailchainTestService = TestBed.inject(MailchainTestService);
    httpTestingController = TestBed.inject(HttpTestingController);

    serverResponse = mailchainTestService.protocolsServerResponse()
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const protocolsService: ProtocolsService = TestBed.inject(ProtocolsService);
    expect(protocolsService).toBeTruthy();
  });

  describe('initUrl', () => {
    it('should initialize the url', () => {
      let protocolsService: ProtocolsService = TestBed.inject(ProtocolsService)
      expect(protocolsService['url']).toEqual('http://127.0.0.1:8080/api/protocols')
    });
  });

  
  describe('getProtocols', () => {
    it('should get an array of protocols and networks', () => {
      protocolsService.getProtocols().subscribe(res => {
        expect(res).toEqual(serverResponse)
      });
  
      // handle open connections
      const req = httpTestingController.expectOne(desiredUrl);
      expect(req.request.method).toBe("GET");
      req.flush(serverResponse);
    });
  });

  describe('getProtocolsByName', () => {
    it('should get the protocols by name', async () => {
      spyOn(protocolsService,'getProtocols').and.returnValue(of(mailchainTestService.protocolsServerResponse()))
      expect(await protocolsService.getProtocolsByName()).toEqual(['algorand', 'ethereum','substrate'])
    });
  });

  describe('getProtocolNetworkAttributes', () => {
    it('should return the attributes for a protocol network', async () => {
      spyOn(protocolsService,'getProtocols').and.returnValue(of(mailchainTestService.protocolsServerResponse()))
      expect(await protocolsService.getProtocolNetworkAttributes("algorand","mainnet")).toEqual(
        {
          "name": "mainnet",
          "id": "",
          "nameservice-domain-enabled": false,
          "nameservice-address-enabled": false
        }
      )
      expect(await protocolsService.getProtocolNetworkAttributes("ethereum","mainnet")).toEqual(
        {
          "name": "mainnet",
          "id": "",
          "nameservice-domain-enabled": true,
          "nameservice-address-enabled": true
        }
      )
      expect(await protocolsService.getProtocolNetworkAttributes("substrate","edgeware-mainnet")).toEqual(
        {
          "name": "edgeware-mainnet",
          "id": "7",
          "nameservice-domain-enabled": false,
          "nameservice-address-enabled": false
        }
      )
    });
  });

});

