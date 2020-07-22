import { Injectable } from '@angular/core';

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
    return this.localStorageCurrentNetwork
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
