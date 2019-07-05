import { Injectable } from '@angular/core';
import { AddressesService } from '../../mailchain/addresses/addresses.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageAccountService {

  constructor(
    private addressesService: AddressesService
  ) { }

  /**
   * Retrieves the current account for the user. If no value is stored, it will try to fetch the first account listed
   */
  async getCurrentAccount(){
    if (sessionStorage['currentAccount'] && sessionStorage['currentAccount']!= "undefined") {
       return sessionStorage.getItem('currentAccount')
     } else {       
       var addresses = await this.addressesService.getAddresses();
       var address = addresses.length ? addresses[0] : ""
       this.setCurrentAccount(address)
       return address
     }
  }

  /**
   * Sets the current account for the user
   * @param address is the public address
   */
  setCurrentAccount(address){
    sessionStorage.setItem('currentAccount', address);
  }

  /**
   * Removes current account
   */
  removeCurrentAccount(){
    sessionStorage.removeItem('currentAccount')
  }


}
