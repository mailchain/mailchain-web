import { Injectable } from '@angular/core';
import { OutboundMail } from 'src/app/models/outbound-mail';
import makeBlockie from 'ethereum-blockies-base64';
import { applicationApiConfig } from 'src/environments/environment';
import { NameserviceService } from './nameservice/nameservice.service';

@Injectable({
  providedIn: 'root'
})
export class MailchainService {

  constructor(
    private nameserviceService: NameserviceService
  ) { }

    /**
   * Generate an outbound message ready to send
   * @param mailObj the Mail object
   * @param contentType the content type [ 'text/plain; charset=\"UTF-8\"' | 'text/html; charset=\"UTF-8\"' ]
   */
  generateMail(mailObj,contentType): OutboundMail {
    
    var envelope = new OutboundMail
    envelope.message["body"] = mailObj["body"]
    envelope.message["headers"]["from"] = mailObj["from"]
    envelope.message["headers"]["reply-to"] = mailObj["from"] //TODO: handle reply-to
    envelope.message["headers"]["to"] = mailObj["to"]
    envelope.message["public-key"] = mailObj["publicKey"]
    envelope.message["subject"] = mailObj["subject"]
    
    switch (contentType) {
      case "html":
        envelope["content-type"] = 'text/html; charset=\"UTF-8\"'
        break;

      default:
        envelope["content-type"] = 'text/plain; charset=\"UTF-8\"'
        break;
    }
    
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
    var regexMailAddr = new RegExp('<0x[0-9a-fA-Z]{40}[@].+>$');
    var regexEthAddr = new RegExp('0x[0-9a-fA-F]{40}$');
    
    if ( regexMailAddr.test(address) ) {
      return makeBlockie(this.parseAddressFromMailchain(address))
    } else if (regexEthAddr.test(address)) {
      return makeBlockie(address);
    } else {
      return ""
    };
  }
  
  /**
   * Return available web protocols supported by mailchain
   */
  getWebProtocols(){
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

  /**
   * Returns the deduplicated message senders
   * @param messages an array of Mailchain messages
   */
  dedupeMessagesBySender(messages:Array<any> = []): Array<any>{
    let output = [];
    
    messages.forEach(msg => {
      var sender = this.parseAddressFromMailchain(msg["headers"]["from"])
      if (!output.includes(sender) ) {
        output.push(sender)  
      }
    });
    return output
  }

  /**
   * Resolves names of uniq message senders from an array of messages
   * @param protocol e.g. Ethereum
   * @param network e.g. mainnet
   * @param messagesArray the message array
   */
  resolveSendersFromMessages(protocol, network, messagesArray){
    let uniqSenders
    let validMsgs
    let output = {}

    validMsgs = this.filterMessages(
      messagesArray,
      {
        status: "ok",
      }
    )
    
    uniqSenders = this.dedupeMessagesBySender(validMsgs);
    
    uniqSenders.forEach(address => {
      this.nameserviceService.resolveAddress(protocol,network,address).subscribe(res =>{        
        if ( res['ok'] ) {
          output[address] = res['body']['name']
        }
      })
    });

    return output
  }

  /**
   * Filter message array
   * @param msgsArray the array of messages
   * @param options: hash with the following options:
   *    status: "ok" 
   *    readState: boolean where false returns unread messages
   *    headersTo: TO address to match
   */
  public filterMessages(msgsArray, options){
    let status = options.status 
    let readState = options.readState
    let headersTo = options.headersTo
    let output = msgsArray
    if (status != undefined) {
      output = output == null ? [] : output.filter(msg => msg.status === status)
    }
    if (readState != undefined) {
      output = output == null ? [] : output.filter(msg => msg.read === readState)
    }
    if (headersTo != undefined) {
      output = output == null ? [] : output.filter(msg => 
        this.parseAddressFromMailchain(msg["headers"]["to"]) == headersTo
      )      
    }
    return output
  }

  /**
   * tests the value matches the ENS Name Regex
   * @param value the ens name value to test, e.g. alice.eth, alice.xyz
   * see tests for conditions 
   */
  public validateEnsName(value){
    let regex = new RegExp('^([0-9a-zA-Z][0-9a-zA-Z\-]{2,}[\.]){1,}[a-zA-Z]{2,}$')
    return regex.test(value)
  };


  /**
   * tests the value matches the Eth Address Regex
   * @param value the address value to test, e.g. 0x000...
   * expects '0x' + 40 hex chars
   */
  public validateEthAddress(value){
    let regex = new RegExp('0x[0-9a-fA-F]{40}$');
    return regex.test(value)
  }

  /**
   * getContentTypeForView: determines how the application should handle various content types in messages.
   * Returns `html` or `plaintext` based on the contentType provided.
   */
  public getContentTypeForView(contentType) {
    switch (contentType) {
      case "text/html; charset=\"UTF-8\"":
      case "text/html; charset='UTF-8'":
        return "html"

      case "text/plain; charset=\"UTF-8\"":
      case "text/plain; charset='UTF-8'":
        return "plaintext"

      default:
        return "plaintext"
    }
  }


} 
