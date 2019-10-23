import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  private url: string

  constructor(
    private http: HttpClient,
    private localStorageServerService: LocalStorageServerService,
    ) {
      this.initUrl()
    }
  
    /**
     * Initialize URL from local storage
     */
    initUrl(){
      this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
    }

  /**
   * Get and return the public addresses from my wallet to send from
   */
  async getAddresses() {
    var addresses = []
    let res = await this.http.get(
      this.url + `/addresses`
      // TODO handle failure
    ).toPromise();      
    res["addresses"].forEach(address => {
      addresses.push(this.handleAddressFormatting(address,'ethereum'))
    });
    return addresses
  }

  handleAddressFormatting(address,chain){
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
  public getAddressesResponse(){
    return this.http.get(
      this.url + `/addresses`,
      {observe: 'response'}
    )
  }

}
