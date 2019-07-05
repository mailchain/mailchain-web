import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

import { ProtocolsService } from './protocols.service';

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
      ],
      imports: [HttpClientTestingModule]
    });
    mailchainTestService = TestBed.get(MailchainTestService);
    
    protocolsService = TestBed.get(ProtocolsService);
    mailchainTestService = TestBed.get(MailchainTestService);
    httpTestingController = TestBed.get(HttpTestingController);

    serverResponse = mailchainTestService.protocolsServerResponse()
  });
  
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const protocolsService: ProtocolsService = TestBed.get(ProtocolsService);
    expect(protocolsService).toBeTruthy();
  });
  
  describe('initUrl', () => {
    it('should initialize the url', () => {    
      let protocolsService: ProtocolsService = TestBed.get(ProtocolsService)
      expect(protocolsService['url']).toEqual('http://127.0.0.1:8080/api')
    });
  });

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

