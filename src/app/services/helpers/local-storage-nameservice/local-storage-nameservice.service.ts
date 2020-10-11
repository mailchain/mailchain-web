import { Injectable } from '@angular/core';
import { ProtocolsService } from '../../mailchain/protocols/protocols.service';
import { LocalStorageProtocolService } from '../local-storage-protocol/local-storage-protocol.service';
import { LocalStorageServerService } from '../local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageNameserviceService {

  constructor(
    private protocolsService: ProtocolsService,
    private localStorageProtocolService: LocalStorageProtocolService,
    private localStorageServerService: LocalStorageServerService,
  ) { }

  /**
   * Gets the current nameservice address enabled status.
   * If no value exists, it attempts to look it up via the protocolsService.
   */
  async getCurrentNameserviceAddressEnabled(){
    if (sessionStorage['currentNameserviceAddressEnabled'] && sessionStorage['currentNameserviceAddressEnabled'] != "undefined") {
      return sessionStorage.getItem('currentNameserviceAddressEnabled')
    } else {
      let currentNetwork = this.localStorageServerService.getCurrentNetwork();
      let currentProtocol = await this.localStorageProtocolService.getCurrentProtocol();

      let status = await this.protocolsService.getProtocolNetworkAttributes(currentProtocol,currentNetwork)

      return this.setCurrentNameserviceAddressEnabled(status["nameservice-address-enabled"].toString())
    }
  }

  /**
   * Sets the current nameservice address enabled status.
   * @param status string: `true` | `false`
   */
  setCurrentNameserviceAddressEnabled(status: string) {
    let val = status.toString() == "true" ? "true" : "false"
    sessionStorage.setItem('currentNameserviceAddressEnabled', val);
    return val
  }

}


