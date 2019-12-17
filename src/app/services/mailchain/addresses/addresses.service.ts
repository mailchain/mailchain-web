import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  private url: string
  private protocol: string
  private network: string

  constructor(
    private http: HttpClient,
    private httpHelpersService: HttpHelpersService,
    private localStorageServerService: LocalStorageServerService,
    private localStorageProtocolService: LocalStorageProtocolService,
  ) {
    this.initUrl()
  }

  /**
   * Initialize URL from local storage
   */
  initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`,
      this.protocol = this.localStorageProtocolService.getCurrentProtocol()
    this.network = this.localStorageServerService.getCurrentNetwork()
  }

  /**
   * Get and return the public addresses from my wallet to send from
   */
  async getAddresses() {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', this.protocol],
      ['network', this.network]
    ])

    var addresses = []
    let res = await this.http.get(
      this.url + `/addresses`,
      httpOptions
      // TODO handle failure
    ).toPromise();
    res["body"]["addresses"].forEach(address => {
      addresses.push(this.handleAddressFormatting(address, 'ethereum'))
    });
    return addresses
  }

  handleAddressFormatting(address, chain) {
    switch (chain) {
      case 'ethereum':
        return '0x' + address.toLowerCase()
      default:
        break;
    }
  }

  /**
   * Returns the addresses response with status codes
   */
  public getAddressesResponse() {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', this.protocol],
      ['network', this.network]
    ])

    return this.http.get(
      this.url + `/addresses`,
      httpOptions
    )
  }

}
