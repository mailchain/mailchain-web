import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressesServiceStub {
  public currentAccount = '0x0123456789012345678901234567890123456789';
  public currentAccount2 = '0x0123456789abcdef0123456789abcdef01234567';
  public addresses = [
    this.currentAccount,
    this.currentAccount2
  ];

  constructor() { }

  async getAddresses() {
    return this.addresses
  }

}
