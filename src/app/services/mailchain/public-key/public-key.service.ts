import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class PublicKeyService {
  private url: string
  private protocol: string

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
  async initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
    this.protocol = await this.localStorageProtocolService.getCurrentProtocol()

  }

  /**
   * Get the public key of a public address
   */
  getPublicKeyFromAddress(public_address, network) {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', this.protocol],
      ['network', network],
      ['address', public_address],
    ])

    return this.http.get(
      `${this.url}/public-key`,
      httpOptions
      // TODO: handle failure
    );
  }

}