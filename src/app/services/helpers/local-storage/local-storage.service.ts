import { Injectable } from '@angular/core';
import { PublicKeyService } from '../../mailchain/public-key/public-key.service';
import { applicationApiConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private publicKeyService: PublicKeyService
  ) { }

  /**
   * Retrieves the current account for the user. If no value is stored, it will try to fetch the first account listed
   */
  async getCurrentAccount(){
    
    if (sessionStorage['currentAccount'] && sessionStorage['currentAccount']!= "undefined") {
       return sessionStorage.getItem('currentAccount')
     } else {       
       var addresses = await this.publicKeyService.getPublicSenderAddresses();
       var address = addresses.length ? addresses[0] : ""
       this.setCurrentAccount(address)
       return address
     }
  }

  /**
   * Sets the current account for the user
   * @param address is the public address
   */
  setCurrentAccount(address){
    sessionStorage.setItem('currentAccount', address);
  }

  /**
   * Retrieves the current account for the user. If no value is stored, it will try to fetch the first account listed
   */
  getCurrentNetwork(){
    
    if (sessionStorage['currentNetwork'] && sessionStorage['currentNetwork']!= "undefined") {
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
  setCurrentNetwork(network){
    sessionStorage.setItem('currentNetwork', network);
  }

  /**
   * Retrieves the current host for the mailchain application. If no value is stored, it will return the default host set in environment.ts
   */
  getCurrentHost(){
    
    if (sessionStorage['currentHost'] && sessionStorage['currentHost']!= "undefined") {
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
  setCurrentHost(host){
    sessionStorage.setItem('currentHost', host);
  }

  /**
   * Retrieves the current port for the mailchain application. If no value is stored, it will return the default port set in environment.ts
   */
  getCurrentPort(){
    
    if (sessionStorage['currentPort'] && sessionStorage['currentPort']!= "undefined") {
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
  setCurrentPort(port){
    sessionStorage.setItem('currentPort', port);
  }

}
