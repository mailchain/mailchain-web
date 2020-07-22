import { TestBed, async } from '@angular/core/testing';

import { LocalStorageAccountService } from './local-storage-account.service';
import { HttpClientModule } from '@angular/common/http';
import { AddressesService } from '../../mailchain/addresses/addresses.service';
import { AddressesServiceStub } from '../../mailchain/addresses/addresses.service.stub';

describe('LocalStorageAccountService', () => {

  let localStorageAccountService: LocalStorageAccountService;
  const currentAccount = '0x0123456789012345678901234567890123456789';
  const currentAccount2 = '0x0123456789abcdef0123456789abcdef01234567';
  const addresses = [currentAccount, currentAccount2];

  const newAddr = '0x12345678901234567890123456789012'

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageAccountService,
        { provide: AddressesService, useClass: AddressesServiceStub },
      ],
      imports: [HttpClientModule]
    });

    localStorageAccountService = TestBed.get(LocalStorageAccountService);
  });

  afterEach(() => {
    sessionStorage.clear();
  })

  it('should be created', () => {
    expect(localStorageAccountService).toBeTruthy();
  });

  describe('getCurrentAccount', () => {
    it('should retrieve the currentAccount when NO value is stored', async () => {
      expect(await localStorageAccountService.getCurrentAccount()).toEqual(currentAccount);
    });

    it('should retrieve the currentAccount when a value is stored', async () => {
      sessionStorage.setItem('currentAccount', newAddr);
      expect(await localStorageAccountService.getCurrentAccount()).toEqual(newAddr);
    });
  });

  describe('setCurrentAccount', () => {
    it('should set the current network', async () => {
      expect(await localStorageAccountService.getCurrentAccount()).not.toEqual(newAddr)
      localStorageAccountService.setCurrentAccount(newAddr)
      expect(await localStorageAccountService.getCurrentAccount()).toEqual(newAddr)
    });
  });

  describe('removeCurrentAccount', () => {
    it('should remove the current network', async () => {
      localStorageAccountService.setCurrentAccount(newAddr)
      expect(await localStorageAccountService.getCurrentAccount()).toEqual(newAddr)
      localStorageAccountService.removeCurrentAccount()
      expect(await localStorageAccountService.getCurrentAccount()).toEqual(currentAccount);
    });
  });
});