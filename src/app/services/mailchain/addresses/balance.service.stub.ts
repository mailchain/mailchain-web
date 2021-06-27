import { Injectable } from '@angular/core';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceServiceStub {
  private url

  constructor(
    private mailchainTestService: MailchainTestService,
    private localStorageServerService: LocalStorageServerService
  ) {

    this.initUrl()
  }

  /**
   * Initialize URL from local storage
   */
  async initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
  }


  async getBalance(address, protocol, network) {
    let addresses = []
    let res: any
    let balance = 0;

    switch (protocol) {
      case 'ethereum':
        res = this.mailchainTestService.senderBalanceEthereumObserveResponse()
        break;
      case 'substrate':
        res = this.mailchainTestService.senderBalanceSubstrateObserveResponse()
        break;
      case 'algorand':
        res = this.mailchainTestService.senderBalanceAlgorandObserveResponse()
        break;
      default:
        break;
    }

    switch (protocol) {
      case 'ethereum':
        balance = ((res["body"]["balance"]) / (10 ** 18))
        break;
      default:
        balance = res["body"]["balance"]
        break;
    }

    return balance;

  }
}
