import { Injectable } from '@angular/core';
import { applicationApiConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServerServiceStub {
  public localStorageCurrentNetwork: string
  public localStorageCurrentWebProtocol: string
  public localStorageCurrentHost: string
  public localStorageCurrentPort: string

  public currentWebProtocol = 'http';
  public currentHost = '127.0.0.1';
  public currentPort = '8080';

  constructor(
  ) { }

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

  setCurrentNetwork(network: string) {
    this.localStorageCurrentNetwork = network
  }

  removeCurrentNetwork() {
    this.localStorageCurrentNetwork = undefined
  }

  getCurrentWebProtocol() {
    return this.localStorageCurrentWebProtocol
  }

  setCurrentWebProtocol(webProtocol: string) {
    this.localStorageCurrentWebProtocol = webProtocol
  }

  getCurrentHost() {
    return this.localStorageCurrentHost
  }

  setCurrentHost(host: string) {
    this.localStorageCurrentHost = host
  }

  getCurrentPort() {
    return this.localStorageCurrentPort
  }

  setCurrentPort(port: string) {
    this.localStorageCurrentPort = port
  }

  getCurrentServerDetails() {
    return `${this.currentWebProtocol}://${this.currentHost}:${this.currentPort}`
  }

}
