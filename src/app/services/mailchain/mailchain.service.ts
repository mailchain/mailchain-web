import { Injectable } from '@angular/core';
import { OutboundMail } from 'src/app/models/outbound-mail';
import makeBlockie from 'ethereum-blockies-base64';
import { applicationApiConfig } from 'src/environments/environment';
import { NameserviceService } from './nameservice/nameservice.service';
import { stringify } from '@angular/compiler/src/util';
import { Mail } from 'src/app/models/mail';
import { LocalStorageNameserviceService } from '../helpers/local-storage-nameservice/local-storage-nameservice.service';

@Injectable({
  providedIn: 'root'
})
export class MailchainService {

  constructor(
    private nameserviceService: NameserviceService,
    private localStorageNameserviceService: LocalStorageNameserviceService
  ) { }

  /**
 * Generate an outbound message ready to send
 * @param mailObj the Mail object
 * @param contentType the content type [ 'text/plain; charset=\"UTF-8\"' | 'text/html; charset=\"UTF-8\"' ]
 * @param envelope the envelope, e.g. 0x01, 0x05 etc.
 * @param protocol the protocol, e.g. ethereum, substrate etc.
 */
  generateMail(mailObj: Mail, contentType: string, envelope: string, protocol: string): OutboundMail {
    var outboundMail = new OutboundMail
    let keytype: string = this.getPublicKeyKindByProtocol(protocol)


    outboundMail.message["headers"]["from"] = mailObj["from"]
    outboundMail.message["headers"]["reply-to"] = mailObj["from"] //TODO: handle reply-to
    outboundMail.message["headers"]["to"] = mailObj["to"]

    outboundMail.message["subject"] = mailObj["subject"]
    outboundMail.message["body"] = mailObj["body"]

    outboundMail.message["public-key"] = mailObj["publicKey"]
    outboundMail.message["public-key-encoding"] = mailObj["publicKeyEncoding"]
    outboundMail.message["public-key-kind"] = mailObj["publicKeyKind"]

    outboundMail["envelope"] = envelope
    // TODO: add method to select encryption types, exlcuding noop
    outboundMail["encryption-method-name"] = mailObj["supportedEncryptionTypes"].filter(a => a != "noop")[0]

    switch (contentType) {
      case "html":
        outboundMail["content-type"] = 'text/html; charset=\"UTF-8\"'
        break;

      default:
        outboundMail["content-type"] = 'text/plain; charset=\"UTF-8\"'
        break;
    }

    return outboundMail

  }

  /**
   * returns the key type to be used in the message
   * @param protocol the keytype 
   */
  private getPublicKeyKindByProtocol(protocol: any) {
    switch (protocol) {
      case 'substrate':
        return 'sr25519'
      case 'ethereum':
      default:
        return 'secp256k1'
    }
  }

  /**
   * Parses an address in Mailchain form and returns public address
   * @param address an address in format '<0x00000000000000000@network.chainname>'
   */
  parseAddressFromMailchain(protocol: string, address: string) {
    switch (protocol) {
      case 'ethereum':
        return this.parseAddressZeroXHexFromMailchain(address)
      case 'substrate':
        return this.parseAddressBase58FromMailchain(address)
      default:
        return ''
    }
  }

  /**
   * Parses an address in Mailchain form and returns public address
   * @param address an address in format '<0x00000000000000000@network.chainname>'
   */
  parseAddressZeroXHexFromMailchain(address: string) {
    var regexMailAddr = new RegExp('<0x[0-9a-fA-Z]{40}[@].+>$');
    if (regexMailAddr.test(address)) {
      return address.substr(1, address.indexOf('@') - 1);
    } else {
      return ''
    }
  }

  /**
   * Parses an address in Mailchain form and returns public address
   * @param address an address in format '<0x00000000000000000@network.chainname>'
   */
  parseAddressBase58FromMailchain(address: string) {
    var regexMailAddr = new RegExp('<[0-9a-zA-Z]+[@].+>$');
    if (regexMailAddr.test(address)) {
      return address.substr(1, address.indexOf('@') - 1);
    } else {
      return ''
    }
  }

  /**
   * Returns the blockie identicon for the address
   * @param address can be Mailchain format or Ethereum format
   */
  public generateIdenticon(protocol: string, address: string) {
    var regexMailAddr = new RegExp('<0x[0-9a-fA-Z]{40}[@].+>$');
    var regexEthAddr = new RegExp('0x[0-9a-fA-F]{40}$');

    if (regexMailAddr.test(address)) {
      return makeBlockie(this.parseAddressFromMailchain(protocol, address))
    } else if (regexEthAddr.test(address)) {
      return makeBlockie(address);
    } else {
      return ""
    };
  }

  /**
   * Return available web protocols supported by mailchain
   */
  getWebProtocols() {
    return applicationApiConfig.webProtocols
  }

  /**
   * Returns the deduplicated message array
   * @param messages an array of Mailchain messages
   * TODO: deprecate this and remove
   */
  dedupeMessagesByIds(messages: Array<any> = []): Array<any> {
    let output = [];

    messages.forEach(msg => {
      var id = msg["headers"]["message-id"]
      var messageIds = output.map(el => el["headers"]["message-id"])
      if (!messageIds.includes(id)) {
        output.push(msg)
      }
    });
    return output
  }

  /**
   * Returns the deduplicated message senders
   * @param messages an array of Mailchain messages
   */
  dedupeMessagesBySender(protocol: string, messages: Array<any> = []): Array<any> {
    let output = [];

    messages.forEach(msg => {
      var sender = this.parseAddressFromMailchain(protocol, msg["headers"]["from"])

      if (!output.includes(sender)) {
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
  async resolveSendersFromMessages(protocol: string, network: string, messagesArray: { headers: { from: string; }; status: string; }[]) {
    let uniqSenders: any[]
    let validMsgs: any[]
    let output = {}

    validMsgs = this.filterMessages(
      protocol,
      messagesArray,
      {
        status: "ok",
      }
    )

    if (await this.localStorageNameserviceService.getCurrentNameserviceAddressEnabled() == "true") {
      uniqSenders = this.dedupeMessagesBySender(protocol, validMsgs);

      await uniqSenders.forEach(async (address: string | number) => {
        let obs = await this.nameserviceService.resolveAddress(protocol, network, address)
        obs.subscribe(res => {
          if (res['ok']) {
            output[address] = res['body']['name']
          }
        })
      });
    }
    return output
  }

  /**
   * Filter message array
   * @param protocol the cureent protocol
   * @param msgsArray the array of messages
   * @param options: hash with the following options:
   *    status: "ok" 
   *    readState: boolean where false returns unread messages
   *    headersTo: TO address to match
   */
  public filterMessages(protocol: string, msgsArray: any[], options: { status?: any; readState?: any; headersTo?: any; }) {
    let status = options.status
    let readState = options.readState
    let headersTo = options.headersTo
    let output = msgsArray
    if (status != undefined) {
      output = output == null ? [] : output.filter((msg: { status: any; }) => msg.status === status)
    }
    if (readState != undefined) {
      output = output == null ? [] : output.filter((msg: { read: any; }) => msg.read === readState)
    }
    if (headersTo != undefined) {
      output = output == null ? [] : output.filter((msg: { [x: string]: { [x: string]: any; }; }) =>
        this.parseAddressFromMailchain(protocol, msg["headers"]["to"]) == headersTo
      )
    }
    return output
  }

  /**
   * tests the value matches the ENS Name Regex
   * @param value the ens name value to test, e.g. alice.eth, alice.xyz
   * see tests for conditions 
   */
  public validateEnsName(value: string) {
    let regex = new RegExp('^([0-9a-zA-Z]{1,}[0-9a-zA-Z\-]{0,}[\.]){1,}[a-zA-Z]{2,}$')
    return regex.test(value)
  };


  /**
   * tests the value matches the Eth Address Regex
   * @param value the address value to test, e.g. 0x000...
   * expects '0x' + 40 hex chars
   */
  public validateEthAddress(value: string) {
    let regex = new RegExp('0x[0-9a-fA-F]{40}$');
    return regex.test(value)
  }

  /**
   * tests the value matches the Substrate Address Regex
   * @param value the address value to test, e.g. TODOTODO
   * expects TODODO
   */
  public validateSubstrateAddress(value: any) {
    // let regex = new RegExp('0x[0-9a-fA-F]{40}$');
    // return regex.test(value)
    return true
  }
  
  /**
   * tests the value matches the Algorand Address Regex
   * @param value the address value to test, e.g. G0GTKMEEEEZH5TFUDYZMWWGXZLO3Z7765CR52ZXBBNCCMNPDYM3ZII7CSI
   * expects Base32 address, 58 chars in length
   */
  public validateAlgorandAddress(value: any) {
    let regex = new RegExp('^[A-Z2-7]{58}$');
    return regex.test(value)
  }

  /**
   * getContentTypeForView: determines how the application should handle various content types in messages.
   * Returns `html` or `plaintext` based on the contentType provided.
   */
  public getContentTypeForView(contentType: string) {
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
