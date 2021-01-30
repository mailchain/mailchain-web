import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

@Injectable({
  providedIn: 'root'
})
export class PublicKeyServiceStub {

  constructor(
    private mailchainTestService: MailchainTestService
  ) {
  }


  /**
   * Get the public key of a public address
   */
  getPublicKeyFromAddress(public_address: any, network: any) {
    return of(
      this.mailchainTestService.publicKeyHexZeroXResponse()
    )
  }

}