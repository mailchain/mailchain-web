import { Injectable } from '@angular/core';
import { applicationApiConfig } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicKeyService {
  private url = `${applicationApiConfig.mailchainNodeBaseUrl}/api`
  
  constructor(
    private http: HttpClient,
  ) { }
    /**
   * Get the public key of a public address
   */
  getPublicKeyFromAddress(public_address, network) { 
    return this.http.get(
      this.url + `/ethereum/${network}/address/${public_address}/public-key`
      // TODO: handle failure
    );
  }

    /**
   * Get and return the public addresses from my wallet to send from
   */
  async getPublicSenderAddresses() {
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
}