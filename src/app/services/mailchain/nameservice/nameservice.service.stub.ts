import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NameserviceServiceStub {
  private addr = '0x0123456789012345678901234567890123456789';
  private addr2 = '0x0123456789abcdef0123456789abcdef01234567';
  private addrNameLookup = 'myaddress.eth';
  private addr2NameLookup = 'someaddress.myaddress.eth';
  constructor(
  ) {
  }

  public resolveName(protocol, network, name) {
    return of(
      { body: { address: this.addr } }
    )
  };

  public resolveAddress(protocol, network, address) {

    let returnVals = {}
    let addresses = [this.addr, this.addr2]

    returnVals[this.addr] = this.addrNameLookup
    returnVals[this.addr2] = this.addr2NameLookup
    if (addresses.includes(address)) {

      return of(
        {
          "body": { name: returnVals[address] },
          "ok": true
        }
      )
    } else {
      return of({ "status": 404 })
    }
  }

}

