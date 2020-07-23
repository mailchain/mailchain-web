import { Injectable } from '@angular/core';
import { ProtocolsService } from '../../mailchain/protocols/protocols.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageProtocolService {

  constructor(
    private protocolsService: ProtocolsService,
  ) { }

  /**
   * Retrieves the current protocol for the application.
   */
  async getCurrentProtocol() {

    if (sessionStorage['currentProtocol'] && sessionStorage['currentProtocol'] != "undefined") {
      return sessionStorage.getItem('currentProtocol')
    } else {
      var protocols = await this.protocolsService.getProtocolsByName()

      var protocol = ""
      if (protocols.length) {
        protocol = protocols.includes('ethereum') ? 'ethereum' : protocols[0]
      }

      this.setCurrentProtocol(protocol)
      return protocol
    }
  }

  /**
   * Sets the current protocol for the user
   * @param protocol is the protocol e.g. ethereum
   */
  setCurrentProtocol(protocol) {
    sessionStorage.setItem('currentProtocol', protocol);
  }

}
