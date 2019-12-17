import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';

@Injectable({
  providedIn: 'root'
})
export class NameserviceService {
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
  initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
    // this.protocol = this.localStorageProtocolService.getCurrentProtocol()
  }

  /**
   * Get address (e.g. 0x...) from name (e.g. alice.eth).
  * @param name the name to lookup
   */
  public resolveName(protocol, network, name) {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', protocol],
      ['network', network],
    ])

    return this.http.get(
      this.url + `/nameservice/name/${name}/resolve`,
      httpOptions
      // TODO: handle failure
    );
  };

  /**
   * Get name (e.g. alice.eth) from address (e.g. 0x...).
   * @param address the public address
   */
  public resolveAddress(protocol, network, address) {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', protocol],
      ['network', network],
    ])

    return this.http.get(
      this.url + `/nameservice/address/${address}/resolve`,
      httpOptions
      // TODO: handle failure
    );

  }

}

