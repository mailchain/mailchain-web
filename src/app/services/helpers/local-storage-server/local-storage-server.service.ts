import { Injectable } from '@angular/core';
import { applicationApiConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServerService {

  constructor(
  ) { }

  /**
   * Retrieves the current network. If no value is stored, it will try to fetch the first network from the environment config
   */
  getCurrentNetwork() {

    if (sessionStorage['currentNetwork'] && sessionStorage['currentNetwork'] != "undefined") {
      return sessionStorage.getItem('currentNetwork')
    } else {
      var networks = applicationApiConfig.networks
      var network = networks.length ? networks[0] : ""
      this.setCurrentNetwork(network)
      return network
    }
  }

  /**
   * Sets the current network for the user
   * @param network is the public network
   */
  setCurrentNetwork(network: string) {
    sessionStorage.setItem('currentNetwork', network);
  }

  /**
   * Removes current network
   */
  removeCurrentNetwork() {
    sessionStorage.removeItem('currentNetwork')
  }

  /**
   * Retrieves the current web protocol for the mailchain application. If no value is stored, it will return the default web protocol set in environment.ts
   */
  getCurrentWebProtocol() {

    if (sessionStorage['currentWebProtocol'] && sessionStorage['currentWebProtocol'] != "undefined") {
      return sessionStorage.getItem('currentWebProtocol')
    } else {
      var webProtocol = applicationApiConfig.mailchainNodeBaseWebProtocol
      this.setCurrentWebProtocol(webProtocol)
      return webProtocol
    }
  }

  /**
   * Sets the current web protocol for the mailchain application
   * @param webProtocol is the server web protocol e.g. http or https
   */
  setCurrentWebProtocol(webProtocol: string) {
    sessionStorage.setItem('currentWebProtocol', webProtocol);
  }

  /**
   * Retrieves the current host for the mailchain application. If no value is stored, it will return the default host set in environment.ts
   */
  getCurrentHost() {
    if (sessionStorage['currentHost'] && sessionStorage['currentHost'] != "undefined") {
      return sessionStorage.getItem('currentHost')
    } else {
      var host = applicationApiConfig.mailchainNodeBaseHost
      this.setCurrentHost(host)
      return host
    }
  }

  /**
   * Sets the current host for the mailchain application
   * @param host is the server host e.g. 127.0.0.1
   */
  setCurrentHost(host: string) {
    sessionStorage.setItem('currentHost', host);
  }

  /**
   * Retrieves the current port for the mailchain application. If no value is stored, it will return the default port set in environment.ts
   */
  getCurrentPort() {

    if (sessionStorage['currentPort'] && sessionStorage['currentPort'] != "undefined") {
      return sessionStorage.getItem('currentPort')
    } else {
      var port = applicationApiConfig.mailchainNodeBasePort
      this.setCurrentPort(port)
      return port
    }
  }

  /**
   * Sets the current port for the mailchain application
   * @param port is the server port e.g. 8080
   */
  setCurrentPort(port: string) {
    sessionStorage.setItem('currentPort', port);
  }

  /**
   * Gets the server `protocol`, `host` & `port`
   */
  getCurrentServerDetails() {
    return `${this.getCurrentWebProtocol()}://${this.getCurrentHost()}:${this.getCurrentPort()}`
  }

}
