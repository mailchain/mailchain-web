import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  private url: string

  constructor(
    private http: HttpClient,
    private httpHelpersService: HttpHelpersService,
    private localStorageServerService: LocalStorageServerService,
  ) {
    this.initUrl()
  }

  /**
   * Initialize URL from local storage
   */
  async initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
  }

  /**
   * Get and return the public addresses from my wallet to send from
   */
  async getAddresses(protocol, network) {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', protocol],
      ['network', network]
    ])

    var addresses = []
    let res = await this.http.get(
      this.url + `/addresses`,
      httpOptions
      // TODO handle failure
    ).toPromise();
    res["body"]["addresses"].forEach(address => {
      addresses.push(this.handleAddressFormatting(address, protocol))
    });
    return addresses
  }

  handleAddressFormatting(address, chain) {
    switch (chain) {
      case 'ethereum':
        return '0x' + address.toLowerCase()
      case 'substrate':
      default:
        return address.toLowerCase()
        break;
    }
  }

  /**
   * Returns the addresses response with status codes
   */
  public getAddressesResponse(protocol, network) {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', protocol],
      ['network', network]
    ])

    return this.http.get(
      this.url + `/addresses`,
      httpOptions
    )
  }

}
