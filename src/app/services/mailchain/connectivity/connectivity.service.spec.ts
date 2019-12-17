import { TestBed } from '@angular/core/testing';

import { ConnectivityService } from './connectivity.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { HttpClient } from '@angular/common/http';
import { VersionService } from '../version/version.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { AddressesService } from '../addresses/addresses.service';

describe('ConnectivityService', () => {
  let mailchainTestService: MailchainTestService
  let connectivityService: ConnectivityService;
  let versionService: VersionService;
  let addressesService: AddressesService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConnectivityService,
        HttpHelpersService,
        VersionService,
        HttpClient
      ],
      imports: [
        HttpClientTestingModule
      ]
    })

    connectivityService = TestBed.get(ConnectivityService);
    mailchainTestService = TestBed.get(MailchainTestService);
    versionService = TestBed.get(VersionService);
    addressesService = TestBed.get(AddressesService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    expect(connectivityService).toBeTruthy();
  });

  describe('getVersionStatus', () => {
    it('should handle dirty semver', () => {
      let resReleaseObs = of({ "tag_name": "v0.0.1" });
      let clientReleaseObs = of({ "version": "0.0.1" });

      spyOn(http, 'get').and.returnValue(resReleaseObs);
      spyOn(versionService, 'getVersion').and.returnValue(clientReleaseObs);

      connectivityService.getVersionStatus()
        .then(res => {
          expect(res["client-version"]).toEqual("0.0.1")
          expect(res["release-version"]).toEqual("0.0.1")
          expect(res["status"]).toEqual("ok")
          expect(res["errors"]).toEqual(0)
        })

    });

    it('should return status unknown if releaseVersion is not present', () => {
      let resReleaseObs = of({ "some_tag": "some_data" });
      let clientReleaseObs = of({ "version": "0.0.1" });

      spyOn(http, 'get').and.returnValue(resReleaseObs);
      spyOn(versionService, 'getVersion').and.returnValue(clientReleaseObs);

      connectivityService.getVersionStatus()
        .then(res => {
          expect(res["client-version"]).toEqual("0.0.1")
          expect(res["release-version"]).toEqual("unknown")
          expect(res["status"]).toEqual("unknown")
          expect(res["errors"]).toEqual(0)
        })
    });
    it('should return status unknown if clientVersion is not present', () => {
      let resReleaseObs = of({ "tag_name": "v0.0.1" });
      let clientReleaseObs = of({ "some_val": "some_data" });

      spyOn(http, 'get').and.returnValue(resReleaseObs);
      spyOn(versionService, 'getVersion').and.returnValue(clientReleaseObs);

      connectivityService.getVersionStatus()
        .then(res => {
          expect(res["client-version"]).toEqual("unknown")
          expect(res["release-version"]).toEqual("0.0.1")
          expect(res["status"]).toEqual("unknown")
          expect(res["errors"]).toEqual(0)
        })
    });

    it('should return status unknown if releaseVersion is not valid', () => {
      let resReleaseObs = of({ "tag_name": "dev" });
      let clientReleaseObs = of({ "version": "0.0.1" });

      spyOn(http, 'get').and.returnValue(resReleaseObs);
      spyOn(versionService, 'getVersion').and.returnValue(clientReleaseObs);

      connectivityService.getVersionStatus()
        .then(res => {
          expect(res["client-version"]).toEqual("0.0.1")
          expect(res["release-version"]).toEqual("unknown")
          expect(res["status"]).toEqual("unknown")
          expect(res["errors"]).toEqual(0)
        })
    });
    it('should return status unknown if clientVersion is not valid', () => {
      let resReleaseObs = of({ "tag_name": "v0.0.1" });
      let clientReleaseObs = of({ "version": "dev" });

      spyOn(http, 'get').and.returnValue(resReleaseObs);
      spyOn(versionService, 'getVersion').and.returnValue(clientReleaseObs);

      connectivityService.getVersionStatus()
        .then(res => {
          expect(res["client-version"]).toEqual("unknown")
          expect(res["release-version"]).toEqual("0.0.1")
          expect(res["status"]).toEqual("unknown")
          expect(res["errors"]).toEqual(0)
        })
    });

    it('should return status ok if releaseVersion is the same as clientVersion', () => {
      let resReleaseObs = of({ "tag_name": "0.0.1" });
      let clientReleaseObs = of({ "version": "0.0.1" });

      spyOn(http, 'get').and.returnValue(resReleaseObs);
      spyOn(versionService, 'getVersion').and.returnValue(clientReleaseObs);

      connectivityService.getVersionStatus()
        .then(res => {
          expect(res["client-version"]).toEqual("0.0.1")
          expect(res["release-version"]).toEqual("0.0.1")
          expect(res["status"]).toEqual("ok")
          expect(res["errors"]).toEqual(0)
        })
    });

    it('should return status outdated if clientVersion is less than releaseVersion', () => {
      let resReleaseObs = of({ "tag_name": "v0.0.3" });
      let clientReleaseObs = of({ "version": "0.0.1" });

      spyOn(http, 'get').and.returnValue(resReleaseObs);
      spyOn(versionService, 'getVersion').and.returnValue(clientReleaseObs);

      connectivityService.getVersionStatus()
        .then(res => {
          expect(res["client-version"]).toEqual("0.0.1")
          expect(res["release-version"]).toEqual("0.0.3")
          expect(res["status"]).toEqual("outdated")
          expect(res["errors"]).toEqual(0)
        })
    });

    it('should return status unknown if clientVersion is greater than releaseVersion', () => {
      let resReleaseObs = of({ "tag_name": "0.0.1" });
      let clientReleaseObs = of({ "version": "0.0.3" });

      spyOn(http, 'get').and.returnValue(resReleaseObs);
      spyOn(versionService, 'getVersion').and.returnValue(clientReleaseObs);

      connectivityService.getVersionStatus()
        .then(res => {
          expect(res["client-version"]).toEqual("0.0.3")
          expect(res["release-version"]).toEqual("0.0.1")
          expect(res["status"]).toEqual("unknown")
          expect(res["errors"]).toEqual(0)
        })
    });

  });

  describe('getResRelease', () => {
    xit('should handle an error fetching resRelease', () => {
      // TODO Add test for:
      //   expect(err["client-version"]).toEqual("0.0.3")
      //   expect(err["release-version"]).toEqual("unknown")
      //   expect(err["release-error-status"]).toEqual(404)
      //   expect(err["release-error-message"]).toEqual("Not found") // or similar
      //   expect(err["status"]).toEqual("unknown")
      //   expect(err["errors"]).toEqual(1)
      // })

    });
  });

  describe('getClientRelease', () => {
    xit('should handle an error fetching clientRelease', () => {
      // TODO Add test for:
      //   expect(err["client-version"]).toEqual("unknown")
      //   expect(err["release-version"]).toEqual("0.0.1")
      //   expect(err["client-error-status"]).toEqual(404)
      //   expect(err["client-error-message"]).toEqual("Not found") // or similar
      //   expect(err["status"]).toEqual("unknown")
      //   expect(err["errors"]).toEqual(1)
      // })
    });
  });


  describe('getApiAvailability', () => {

    it('should return the number of configured addresses', () => {
      let expectedAddressesObs = of(mailchainTestService.senderAddressesObserveResponse())
      spyOn(addressesService, 'getAddressesResponse').and.returnValue(expectedAddressesObs);

      connectivityService.getApiAvailability().then(res => {
        expect(res["addresses"]).toEqual(2)
        expect(res["status"]).toEqual("ok")
        expect(res["code"]).toEqual(200)
        expect(res["message"]).toEqual("OK")
      })
    });

    it('should return 0 addresses when none are configured', () => {
      let expectedAddressesObs = of(mailchainTestService.senderAddressesObserveResponseNoAddress())
      spyOn(addressesService, 'getAddressesResponse').and.returnValue(expectedAddressesObs);

      connectivityService.getApiAvailability().then(res => {
        expect(res["addresses"]).toEqual(0)
        expect(res["status"]).toEqual("ok")
        expect(res["code"]).toEqual(200)
        expect(res["message"]).toEqual("OK")
      })
    });

    xit('should return error and message when the client is not available', () => {
      // TODO add test for error scenario
    });
    it('should return status "ok" when client is running and configured', () => {
      let expectedAddressesObs = of(mailchainTestService.senderAddressesObserveResponse())
      spyOn(addressesService, 'getAddressesResponse').and.returnValue(expectedAddressesObs);

      connectivityService.getApiAvailability().then(res => {
        expect(res["status"]).toEqual("ok")
      })
    });
    xit('should return status "error" when client is NOT running', () => {
      // TODO add test for error scenario
    });
    xit('should return error message when client is NOT running', () => {
      // TODO add test for error scenario
    });
  });
});
