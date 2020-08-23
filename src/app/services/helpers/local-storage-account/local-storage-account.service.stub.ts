import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageAccountServiceStub {
  private localStorageCurrentAccount: string

  constructor(
  ) { }

  async getCurrentAccount() {
    return this.localStorageCurrentAccount
  }


  setCurrentAccount(address: string) {
    this.localStorageCurrentAccount = address
  }

  removeCurrentAccount() {
    this.localStorageCurrentAccount = undefined

  }


}
