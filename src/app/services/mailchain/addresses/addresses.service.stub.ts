import { Injectable } from '@angular/core';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class AddressesServiceStub {
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


  async getAddresses(protocol, network) {
    let addresses = []
    let res: any

    switch (protocol) {
      case 'ethereum':
        res = this.mailchainTestService.senderAddressesEthereumObserveResponse()
        break;
      case 'substrate':
        res = this.mailchainTestService.senderAddressesSubstrateObserveResponse()
        break;
      default:
        break;
    }
    res["body"]["addresses"].forEach(address => {
      addresses.push(
        this.handleAddressFormatting(
          address["value"],
          address["encoding"]
        )
      )
    });
    return addresses
  }

  handleAddressFormatting(address, encoding) {
    switch (encoding) {
      case 'hex/0x-prefix':
        return address.toLowerCase()
      case 'base58/plain':
      default:
        return address
    }
  }

  handleAddressFormattingByProtocol(address, protocol) {
    switch (protocol) {
      case 'ethereum':
        return address.toLowerCase()
      case 'substrate':
      default:
        return address
    }
  }

}
