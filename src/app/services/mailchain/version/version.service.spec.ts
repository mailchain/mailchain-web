import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

import { VersionService } from './version.service';

describe('VersionService', () => {
  let versionService: VersionService;
  let httpTestingController: HttpTestingController;
  let mailchainTestService: MailchainTestService;
  let serverResponse

  const desiredUrl = `http://127.0.0.1:8080/api/version`

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VersionService,
      ],
      imports: [HttpClientTestingModule]
    });
    mailchainTestService = TestBed.inject(MailchainTestService);

    versionService = TestBed.inject(VersionService);
    mailchainTestService = TestBed.inject(MailchainTestService);
    httpTestingController = TestBed.inject(HttpTestingController);

    serverResponse = mailchainTestService.versionServerResponse()
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: VersionService = TestBed.inject(VersionService);
    expect(service).toBeTruthy();
  });

  describe('initUrl', () => {
    it('should initialize the url', () => {
      let versionService: VersionService = TestBed.inject(VersionService)
      expect(versionService['url']).toEqual('http://127.0.0.1:8080/api')
    });
  });

  it('should return version info', () => {
    versionService.getVersion().subscribe(res => {
      expect(res).toEqual(serverResponse)
    });

    // handle open connections
    const req = httpTestingController.expectOne(desiredUrl);
    expect(req.request.method).toBe("GET");
    req.flush(serverResponse);
  });

});
