import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AddressesService } from './addresses.service';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { ProtocolsServiceStub } from '../protocols/protocols.service.stub';
import { ProtocolsService } from '../protocols/protocols.service';
import { AddressesServiceStub } from './addresses.service.stub';


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
        HttpHelpersService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        { provide: AddressesService, useClass: AddressesServiceStub },
      ],
      imports: [HttpClientTestingModule]
    });

    addressesService = TestBed.get(AddressesService);
    mailchainTestService = TestBed.get(MailchainTestService);
    httpTestingController = TestBed.get(HttpTestingController);

    serverResponse = mailchainTestService.senderAddressesEthereumObserveResponse()
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

  it('should get an array of sender addresses', async () => {
    let result
    await addressesService.getAddresses('ethereum', 'mainnet').then(res => {
      result = res
    });
    expect(result).toEqual(expectedAddresses)
  });
});
