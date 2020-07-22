import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicKeyServiceStub {

  constructor() {
  }


  /**
   * Get the public key of a public address
   */
  getPublicKeyFromAddress(public_address: any, network: any) {
    return of(['1234567890'])
  }

}