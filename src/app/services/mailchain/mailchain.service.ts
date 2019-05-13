import { Injectable } from '@angular/core';
import { OutboundMail } from 'src/app/models/outbound-mail';
import makeBlockie from 'ethereum-blockies-base64';
import { applicationApiConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailchainService {

  constructor(
  ) { }

    /**
   * Generate an outbound message ready to send
   * @param mailObj the Mail object
   */
  generateMail(mailObj): OutboundMail {
    
    var envelope = new OutboundMail
    envelope.message["body"] = mailObj["body"]
    envelope.message["headers"]["from"] = mailObj["from"]
    envelope.message["headers"]["reply-to"] = mailObj["from"] //TODO: handle reply-to
    envelope.message["headers"]["to"] = mailObj["to"]
    envelope.message["public-key"] = mailObj["publicKey"]
    envelope.message["subject"] = mailObj["subject"]
    
    return envelope
    
  }

  /**
   * Parses an address in Mailchain form and returns public address
   * @param address an address in format '<0x00000000000000000@network.chainname>'
   */
  parseAddressFromMailchain(address) {
    var regexMailAddr = new RegExp('<0x[0-9a-fA-Z]{40}[@].+>$');
    if ( regexMailAddr.test(address) ) {
      return address.substr(1, address.indexOf('@')-1 );
    }
  }

  /**
   * Returns the blockie identicon for the address
   * @param address can be Mailchain format or Ethereum format
   */
  public generateIdenticon(address){
    var addr
    var regexMailAddr = new RegExp('<0x[0-9a-fA-Z]{40}[@].+>$');
    var regexEthAddr = new RegExp('0x[0-9a-fA-Z]{40}$');
    
    if ( regexMailAddr.test(address) ) {
      addr = this.parseAddressFromMailchain(address)
    } else if (regexEthAddr.test(address)) {
      addr = address;
    }
    
    return makeBlockie(addr)
  }

  /**
   * Return available networks supported by mailchain
   */
  getPublicNetworks(){
    // TODO add method for getting networks
    return  applicationApiConfig.networks
  }
  
  /**
   * Return available web protocols supported by mailchain
   */
  getWebProtocols(){
    // TODO add method for getting networks
    return  applicationApiConfig.webProtocols
  }

  /**
   * Returns the deduplicated message array
   * @param messages an array of Mailchain messages
   * TODO: deprecate this and remove
   */
  dedupeMessagesByIds(messages:Array<any> = []): Array<any>{
    let output = [];
    
    messages.forEach(msg => {
      var id = msg["headers"]["message-id"]  
      var messageIds = output.map(el => el["headers"]["message-id"])
      if (!messageIds.includes(id) ) {
        output.push(msg)  
      }
    });
    return output
  }

} 
