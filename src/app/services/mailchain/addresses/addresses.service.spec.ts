import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AddressesService } from './addresses.service';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { ProtocolsServiceStub } from '../protocols/protocols.service.stub';
import { ProtocolsService } from '../protocols/protocols.service';
import { of } from 'rxjs';


describe('AddressesService', () => {

  let addressesService: AddressesService;
  let httpTestingController: HttpTestingController;
  let mailchainTestService: MailchainTestService
  let serverResponse

  const desiredUrl = `http://127.0.0.1:8080/api/addresses?protocol=ethereum&network=mainnet`

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpHelpersService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        AddressesService,
      ],
      imports: [HttpClientTestingModule]
    });

    addressesService = TestBed.get(AddressesService);
    mailchainTestService = TestBed.get(MailchainTestService);
    httpTestingController = TestBed.get(HttpTestingController);

    serverResponse = mailchainTestService.senderAddressesEthereumObserveResponse()
    // expectedAddresses = mailchainTestService.senderAddresses()
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  describe('initUrl', () => {
    it('should initialize the url', () => {
      addressesService.initUrl()
      expect(addressesService['url']).toEqual('http://127.0.0.1:8080/api')
    });
  })

  it('should be created', () => {
    expect(addressesService).toBeTruthy();
  });

  describe('getAddresses', () => {
    beforeEach(() => {
      spyOn(addressesService, 'getAddresses').and.returnValue(
        of(mailchainTestService.senderAddressesEthereumObserveResponse()).toPromise()
      )
    });
    it('should get an array of sender addresses', async () => {
      let result
      await addressesService.getAddresses('ethereum', 'mainnet').then(res => {
        result = res
      });
      expect(result).toEqual(mailchainTestService.senderAddressesEthereumObserveResponse())
      expect(addressesService.getAddresses).toHaveBeenCalled()
    });
  });
  describe('handleAddressFormatting', () => {
    it('should return address when "hex/0x-prefix" is specified', () => {
      let address: string = mailchainTestService.senderAddressesHex0xPrefix()[0]
      let result: string = addressesService.handleAddressFormatting(address, 'hex/0x-prefix')
      expect(result).toEqual(address)
    });
    it('should return converted "hex/0x-prefix" as lowercase', () => {
      let address: string = mailchainTestService.senderAddressesHex0xPrefix()[0].toUpperCase()
      let result: string = addressesService.handleAddressFormatting(address, 'hex/0x-prefix')
      expect(result).toEqual(address.toLowerCase())
    });
    it('should return address when "base58/plain" is specified', () => {
      let address: string = mailchainTestService.senderAddressesBase58Plain()[0]
      let result: string = addressesService.handleAddressFormatting(address, 'base58/plain')
      expect(result).toEqual(address)
    });
    it('should NOT return converted "base58/plain" as lowercase', () => {
      let address: string = mailchainTestService.senderAddressesBase58Plain()[0]
      let result: string = addressesService.handleAddressFormatting(address, 'base58/plain')
      expect(result).not.toEqual(address.toLowerCase())
    });
    it('should return address when an unknown format is specified', () => {
      let address: string = mailchainTestService.senderAddressesBase58Plain()[0]
      let result: string = addressesService.handleAddressFormatting(address, 'base12/unknown')
      expect(result).toEqual(address)
    });
    it('should NOT return converted unknown format as lowercase', () => {
      let address: string = mailchainTestService.senderAddressesBase58Plain()[0]
      let result: string = addressesService.handleAddressFormatting(address, 'base12/unknown')
      expect(result).not.toEqual(address.toLowerCase())
    });
  });
  describe('handleAddressFormattingByProtocol', () => {
    it('should return address when "ethereum" is specified', () => {
      let address: string = mailchainTestService.senderAddressesHex0xPrefix()[0]
      let result: string = addressesService.handleAddressFormattingByProtocol(address, 'ethereum')
      expect(result).toEqual(address)
    });
    it('should return converted "ethereum" as lowercase', () => {
      let address: string = mailchainTestService.senderAddressesHex0xPrefix()[0].toUpperCase()
      let result: string = addressesService.handleAddressFormattingByProtocol(address, 'ethereum')
      expect(result).toEqual(address.toLowerCase())
    });
    it('should return address when "substrate" is specified', () => {
      let address: string = mailchainTestService.senderAddressesBase58Plain()[0]
      let result: string = addressesService.handleAddressFormattingByProtocol(address, 'substrate')
      expect(result).toEqual(address)
    });
    it('should NOT return converted "substrate" as lowercase', () => {
      let address: string = mailchainTestService.senderAddressesBase58Plain()[0]
      let result: string = addressesService.handleAddressFormattingByProtocol(address, 'substrate')
      expect(result).not.toEqual(address.toLowerCase())
    });
    it('should return address when an unknown protocol is specified', () => {
      let address: string = mailchainTestService.senderAddressesBase58Plain()[0]
      let result: string = addressesService.handleAddressFormattingByProtocol(address, 'unknown-protocol')
      expect(result).toEqual(address)
    });
    it('should NOT return converted unknown protocol as lowercase', () => {
      let address: string = mailchainTestService.senderAddressesBase58Plain()[0]
      let result: string = addressesService.handleAddressFormattingByProtocol(address, 'unknown-protocol')
      expect(result).not.toEqual(address.toLowerCase())
    });
  });
});
