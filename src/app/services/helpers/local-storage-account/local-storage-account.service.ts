import { Injectable } from '@angular/core';
import { PublicKeyService } from '../../mailchain/public-key/public-key.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageAccountService {

  constructor(
    private publicKeyService: PublicKeyService
  ) { }

  /**
   * Retrieves the current account for the user. If no value is stored, it will try to fetch the first account listed
   */
  async getCurrentAccount(){
    if (sessionStorage['currentAccount'] && sessionStorage['currentAccount']!= "undefined") {
       return sessionStorage.getItem('currentAccount')
     } else {       
       var addresses = await this.publicKeyService.getPublicSenderAddresses();
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
