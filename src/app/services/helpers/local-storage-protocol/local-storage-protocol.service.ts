import { Injectable } from '@angular/core';
import { applicationApiConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageProtocolService {

  constructor(
  ) { }

  /**
   * Retrieves the current protocol for the application.
   */
  getCurrentProtocol() {

    if (sessionStorage['currentProtocol'] && sessionStorage['currentProtocol'] != "undefined") {
      return sessionStorage.getItem('currentProtocol')
    } else {
      var protocols = applicationApiConfig.protocols
      var protocol = protocols.length ? protocols[0] : ""
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
