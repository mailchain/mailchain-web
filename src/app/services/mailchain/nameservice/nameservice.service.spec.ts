import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NameserviceService } from './nameservice.service';

import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

import { MailchainTestService } from '../../../test/test-helpers/mailchain-test.service';
import { ProtocolsService } from '../protocols/protocols.service';
import { ProtocolsServiceStub } from '../protocols/protocols.service.stub';

describe('NameserviceService', () => {

  let nameserviceService: NameserviceService;
  let httpTestingController: HttpTestingController;
  let mailchainTestService: MailchainTestService;
  let protocolsService: ProtocolsService;


  let address: String = "0x0000000000000000000000000000000000000022"
  let protocol: String = "ethereum"
  let network: String = "testnet"
  let name: String = "mailchain.eth"

  let expectedResolveNameUrlWithParams = `http://127.0.0.1:8080/api/nameservice/name/${name}/resolve?protocol=${protocol}&network=${network}`
  let expectedResolveAddressUrlWithParams = `http://127.0.0.1:8080/api/nameservice/address/${address}/resolve?protocol=${protocol}&network=${network}`

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NameserviceService,
        HttpHelpersService,
        MailchainTestService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
      ],
      imports: [HttpClientTestingModule]
    });

    nameserviceService = TestBed.inject(NameserviceService);
    httpTestingController = TestBed.inject(HttpTestingController);
    mailchainTestService = TestBed.inject(MailchainTestService);
    protocolsService = TestBed.inject(ProtocolsService);


  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(nameserviceService).toBeTruthy();
  });

  describe('initUrl', () => {
    it('should initialize the url', () => {
      expect(nameserviceService['url']).toEqual('http://127.0.0.1:8080/api')
    });
  });

  describe('resolveName', () => {
    it('should add the right params to the request', async () => {
      let resResponse = mailchainTestService.resolveNameResponse()
      let response = await nameserviceService.resolveName(protocol, network, name)
      
      response.subscribe()

      // handle open connections      
      const req = httpTestingController.expectOne(expectedResolveNameUrlWithParams);

      expect(req.request.method).toBe("GET");
      
      expect(req.request.params.get('protocol')).toEqual(protocol);
      expect(req.request.params.get('network')).toEqual(network);

      req.flush(resResponse);
    });

    it('should resolve a public address from a name', async () => {

      let resResponse = mailchainTestService.resolveNameResponse()
      let response = await nameserviceService.resolveName(protocol, network, name)

      response.subscribe(res => {
        expect(res['url']).toEqual(expectedResolveNameUrlWithParams)
        expect(res['body']['address']).toEqual(address)
      })

      // handle open connections      
      const req = httpTestingController.expectOne(expectedResolveNameUrlWithParams);
      expect(req.request.method).toBe("GET");

      req.flush(resResponse);
    });

  });

  describe('resolveAddress', () => {
    it('should add the right params to the request', async () => {

      let resResponse = mailchainTestService.resolveAddressResponse()
      let response = await nameserviceService.resolveAddress(protocol, network, address)

      response.subscribe()

      // handle open connections      
      const req = httpTestingController.expectOne(expectedResolveAddressUrlWithParams);

      expect(req.request.method).toBe("GET");

      expect(req.request.params.get('protocol')).toEqual(protocol);
      expect(req.request.params.get('network')).toEqual(network);

      req.flush(resResponse);
    });

    it('should resolve a name from a public address', async () => {

      let resResponse = mailchainTestService.resolveAddressResponse()
      let response = await nameserviceService.resolveAddress(protocol, network, address)

      response.subscribe(res => {
        expect(res['url']).toEqual(expectedResolveAddressUrlWithParams)
        expect(res['body']['name']).toEqual(name)
      })

      // handle open connections      
      const req = httpTestingController.expectOne(expectedResolveAddressUrlWithParams);
      // const req = httpTestingController.expectOne({method: "GET"});
      expect(req.request.method).toBe("GET");

      req.flush(resResponse);
    });

  });

});
