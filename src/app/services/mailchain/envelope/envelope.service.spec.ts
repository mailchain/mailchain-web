import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EnvelopeService } from './envelope.service';

import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';


describe('EnvelopeService', () => {

  let envelopeService: EnvelopeService;
  let httpTestingController: HttpTestingController;
  let mailchainTestService: MailchainTestService
  let serverResponse
  let expectedAddresses

  const desiredUrl = `http://127.0.0.1:8080/api/envelope`

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnvelopeService,
        HttpHelpersService,
      ],
      imports: [HttpClientTestingModule]
    });

    envelopeService = TestBed.get(EnvelopeService);
    mailchainTestService = TestBed.get(MailchainTestService);
    httpTestingController = TestBed.get(HttpTestingController);

    serverResponse = mailchainTestService.envelopeTypesMultiple()
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: EnvelopeService = TestBed.get(EnvelopeService);
    expect(service).toBeTruthy();
  });


  describe('initUrl', () => {
    it('should initialize the url', () => {
      expect(envelopeService['url']).toEqual('http://127.0.0.1:8080/api')
    });
  })

  it('should get an array of envelope types with their description', () => {
    envelopeService.getEnvelope().then(res => {
      expect(res).toEqual(serverResponse)
    });

    // handle open connections
    const req = httpTestingController.expectOne(desiredUrl);
    expect(req.request.method).toBe("GET");
    req.flush(serverResponse);
  });

});
