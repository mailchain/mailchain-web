import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class PublicKeyService {
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
   * Get the public key of a public address
   */
  getPublicKeyFromAddress(public_address, network) { 
    return this.http.get(
      this.url + `/ethereum/${network}/address/${public_address}/public-key`
      // TODO: handle failure
    );
  }

}