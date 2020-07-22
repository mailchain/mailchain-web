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

}
