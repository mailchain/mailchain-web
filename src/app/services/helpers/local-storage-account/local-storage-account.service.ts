import { Injectable } from '@angular/core';
import { AddressesService } from '../../mailchain/addresses/addresses.service';
import { LocalStorageProtocolService } from '../local-storage-protocol/local-storage-protocol.service';
import { LocalStorageServerService } from '../local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageAccountService {

  constructor(
    private addressesService: AddressesService,
    private localStorageProtocolService: LocalStorageProtocolService,
    private localStorageServerService: LocalStorageServerService,
  ) { }

  /**
   * Retrieves the current account for the user. If no value is stored, it will try to fetch the first account listed
   */
  async getCurrentAccount() {
    if (sessionStorage['currentAccount'] && sessionStorage['currentAccount'] != "undefined") {
      return sessionStorage.getItem('currentAccount')
    } else {
      let protocol = await this.localStorageProtocolService.getCurrentProtocol()
      let network = await this.localStorageServerService.getCurrentNetwork()
      var addresses = await this.addressesService.getAddresses(protocol, network);
      var address = addresses.length ? addresses[0] : ""
      this.setCurrentAccount(address)
      return address
    }
  }

  /**
   * Sets the current account for the user
   * @param address is the public address
   */
  setCurrentAccount(address) {
    sessionStorage.setItem('currentAccount', address);
  }

  /**
   * Removes current account
   */
  removeCurrentAccount() {
    sessionStorage.removeItem('currentAccount')
  }


}
