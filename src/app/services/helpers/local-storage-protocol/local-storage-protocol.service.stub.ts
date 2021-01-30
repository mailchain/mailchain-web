import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageProtocolServiceStub {

  constructor(
  ) { }

  async getCurrentProtocol() {
    return 'myProtocol'
  }

  setCurrentProtocol(protocol) {

  }

}
