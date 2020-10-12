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
   * Gets the current nameservice address lookup enabled status.
   * If no value exists, it attempts to look it up via the protocolsService.
   */
  async getCurrentNameserviceAddressEnabled(){
    if (sessionStorage['currentNameserviceAddressEnabled'] && sessionStorage['currentNameserviceAddressEnabled'] != "undefined") {
      return sessionStorage.getItem('currentNameserviceAddressEnabled')
    } else {
      let currentNetwork = this.localStorageServerService.getCurrentNetwork();
      let currentProtocol = await this.localStorageProtocolService.getCurrentProtocol();
      if (![currentProtocol,currentNetwork].includes(undefined)) {
        let status = await this.protocolsService.getProtocolNetworkAttributes(currentProtocol,currentNetwork)
        return this.setCurrentNameserviceAddressEnabled(status["nameservice-address-enabled"].toString())
      } else {
        return this.setCurrentNameserviceAddressEnabled("false")
      }
    }
  }

  /**
   * Sets the current nameservice address lookup enabled status.
   * @param status string: `true` | `false`
   */
  setCurrentNameserviceAddressEnabled(status: string) {
    let val = status.toString() == "true" ? "true" : "false"
    sessionStorage.setItem('currentNameserviceAddressEnabled', val);
    return val
  }

  /**
   * Removes the nameservice address lookup enabled value
   */
  removeCurrentNameserviceAddressEnabled(){
    sessionStorage.removeItem('currentNameserviceAddressEnabled')
  }


  /**
   * Gets the current nameservice domain lookup enabled status.
   * If no value exists, it attempts to look it up via the protocolsService.
   */
  async getCurrentNameserviceDomainEnabled(){
    if (sessionStorage['currentNameserviceDomainEnabled'] && sessionStorage['currentNameserviceDomainEnabled'] != "undefined") {
      return sessionStorage.getItem('currentNameserviceDomainEnabled')
    } else {
      let currentNetwork = this.localStorageServerService.getCurrentNetwork();
      let currentProtocol = await this.localStorageProtocolService.getCurrentProtocol();

      if (![currentProtocol,currentNetwork].includes(undefined)) {
        let status = await this.protocolsService.getProtocolNetworkAttributes(currentProtocol,currentNetwork)
        return this.setCurrentNameserviceDomainEnabled(status["nameservice-domain-enabled"].toString())
      } else {
        return this.setCurrentNameserviceDomainEnabled("false")
      }      
    }
  }

  /**
   * Sets the current nameservice domain lookup enabled status.
   * @param status string: `true` | `false`
   */
  setCurrentNameserviceDomainEnabled(status: string) {
    let val = status.toString() == "true" ? "true" : "false"
    sessionStorage.setItem('currentNameserviceDomainEnabled', val);
    return val
  }

  /**
   * Removes the nameservice domain lookup enabled value
   */
  removeCurrentNameserviceDomainEnabled(){
    sessionStorage.removeItem('currentNameserviceDomainEnabled')
  }

}


