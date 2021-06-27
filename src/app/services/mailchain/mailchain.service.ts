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
   * parseAddressFieldOnly removes other header fields to return only the addressable portion of the field
   * @param address 
   * @returns addr: '<33456789@network.protocol>'
   */
  parseAddressFieldOnly(address: string) {
    var arr = address.match(/<.*[@].*>/);
    return (arr[0]);
  }

  /**
   * Parses an address in Mailchain form and returns public address
   * @param address an address in format '<0x00000000000000000@network.chainname>'
   */
  parseAddressFromMailchain(protocol: string, address: string) {
    let addr = this.parseAddressFieldOnly(address)
    switch (protocol) {
      case 'ethereum':
        return this.parseAddressZeroXHexFromMailchain(addr)
      case 'substrate':
        return this.parseAddressBase58FromMailchain(addr)
      case 'algorand':
        return this.parseAddressBase32FromMailchain(addr)
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
   * @param address an address in format '<00000000000000000@network.chainname>'
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
   * Parses an address in Mailchain form and returns public address
   * @param address an address in format '<00000000000000000@network.chainname>'
   */
  parseAddressBase32FromMailchain(address: string) {
    var regexMailAddr = new RegExp('<[A-Z2-7]+[@].+>$');
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
      return this.mailchainLogoIdenticonImage()
    };
  }

  /***
   * returns the base64 image for default mailchain logo identicon
   */
  public mailchainLogoIdenticonImage() {
    return "data:image/png;base64,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"
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
   * @param value the address value to test, e.g. 15GJj1Lg6kL5bsN49fV1gcd4ezvU6wafsfZn3oZ7bf7EeM5U
   * expects Base58 address, length is variable because Polkadot length can change,
   * although is commonly 47 or 48 chars in length, and expected to be > 20 chars
   */
  public validateSubstrateAddress(value: any) {
    let regex = new RegExp('^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{20,}$');
    return regex.test(value)
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

  /**
   * Returns the currency on basis of the selected protocol in Mailchain 
   * @param protocol the cureent protocol
   */
  getCurrencyForProtocol(protocol: string) {

    switch (protocol) {
      case 'ethereum':
        return "ETH"
      case 'substrate':
        return ""
      case 'algorand':
        return "ALGO"
      default:
        return ''
    }
  }

}
