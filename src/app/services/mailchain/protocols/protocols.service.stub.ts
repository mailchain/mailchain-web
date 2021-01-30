import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

@Injectable({
  providedIn: 'root'
})
export class ProtocolsServiceStub {

  constructor(
    private mailchainTestService: MailchainTestService
  ) {
  }

  /**
   * Get and return the protocols configured on the api application
   */
  getProtocols() {
    return of(this.mailchainTestService.protocolsServerResponse())
  }

  getProtocolsByName() {
    return ["ethereum", "substrate"]
  }

  async getProtocolNetworkAttributes(protocol: string, network: string) {
    let res = this.mailchainTestService.protocolsServerResponse()
    let attributes = {}
    let p = res["protocols"].find(el => el["name"] == protocol)
    attributes = p["networks"].find(nw => nw["name"] == network)
    return attributes
  }

  public getProtocolsResponse() {
    return of(this.mailchainTestService.protocolsObserveResponse())
  }

}
