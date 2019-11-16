import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AddressesService } from './addresses.service';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';


describe('AddressesService', () => {

  let addressesService: AddressesService;
  let httpTestingController: HttpTestingController;
  let mailchainTestService: MailchainTestService
  let serverResponse
  let expectedAddresses

  const desiredUrl = `http://127.0.0.1:8080/api/addresses?protocol=ethereum&network=mainnet`
  
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressesService,
        HttpHelpersService,
      ],
      imports: [HttpClientTestingModule]
    });
    
    addressesService = TestBed.get(AddressesService);
    mailchainTestService = TestBed.get(MailchainTestService);
    httpTestingController = TestBed.get(HttpTestingController);

    serverResponse = mailchainTestService.senderAddressServerResponse()
    expectedAddresses = mailchainTestService.senderAddresses()
  });
  
  afterEach(() => {
    httpTestingController.verify();
  });


  describe('initUrl', () => {
    it('should initialize the url', () => {    
      expect(addressesService['url']).toEqual('http://127.0.0.1:8080/api')
    });
  })

  it('should be created', () => {
    expect(addressesService).toBeTruthy();
  });

  it('should get an array of sender addresses', () => {    
    addressesService.getAddresses().then(res => {
      expect(res).toEqual(expectedAddresses)
    });
    
    // handle open connections
    const req = httpTestingController.expectOne(desiredUrl);
    expect(req.request.method).toBe("GET");
    req.flush(serverResponse);
  });
});
