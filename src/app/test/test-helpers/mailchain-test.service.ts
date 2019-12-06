import { Injectable } from '@angular/core';
import { OutboundMail } from 'src/app/models/outbound-mail';

@Injectable({
  providedIn: 'root'
})
export class MailchainTestService {

  constructor() { }
  
  public outboundMailObject(): OutboundMail {
    
    let outboundMailObject = new OutboundMail
    outboundMailObject["message"] = {
      "body": "Hi Sofia,\n\nHow are you?\n\nBest Wishes\n\nCharlotte",
      "headers": {
        "from": "0x92d8f10248c6a3953cc3692a894655ad05d61efb",
        "reply-to": "0x92d8f10248c6a3953cc3692a894655ad05d61efb",
        "to": "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6"
      },
      "public-key": "0x69d908510e355beb1d5bf2df8129e5b6401e1969891e8016a0b2300739bbb00687055e5924a2fd8dd35f069dc14d8147aa11c1f7e2f271573487e1beeb2be9d0",
      "subject": "Test message",
    }

    return outboundMailObject
  }
  
  public outboundMailObjectPlainText(): OutboundMail {
    let outboundMailObject = this.outboundMailObject()
    outboundMailObject["content-type"] = "text/plain; charset=\"UTF-8\""
    return outboundMailObject
  }

  public outboundMailObjectHtml(): OutboundMail {
    let outboundMailObject = this.outboundMailObject()
    outboundMailObject["content-type"] = "text/html; charset=\"UTF-8\""
    return outboundMailObject
  }

  public sendMailResponse(): any {
    return {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null,
        "headers": {}
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://127.0.0.1:8080/api/messages?protocol=ethereum&network=ropsten",
      "ok": true,
      "type": 4,
      "body": null
    }
  }

  public messagesResponse(): any {
    return {
      "messages": [
        {
          "headers": {
            "date": "2019-06-07T14:53:36Z",
            "from": "\u003c0x0123456789012345678901234567890123456789@testnet.ethereum\u003e",
            "to": "\u003c0x0123456789abcdef0123456789abcdef01234567@testnet.ethereum\u003e",
            "message-id": "0020c"
          },
          "body": "",
          "subject": "Re: Mailchain Test!",
          "status": "ok",
          "status-code": "",
          "read": true
        },
        {
          "headers": {
            "date": "2019-05-06T11:23:13Z",
            "from": "\u003c0x0123456789abcdef0123456789abcdef01234567@testnet.ethereum\u003e",
            "to": "\u003c0x0000000000000000000000000000000000000000@testnet.ethereum\u003e",
            "message-id": "0020f"
          },
          "body": "",
          "subject": "Sender to Recipient",
          "status": "ok",
          "status-code": "",
          "read": true
        },
        {
          "status": "could not decrypt location: invalid mac",
          "status-code": "",
          "read": false
        },
        {
          "headers": {
            "date": "2019-06-07T13:52:28Z",
            "from": "\u003c0x0123456789012345678901234567890123456789@testnet.ethereum\u003e",
            "to": "\u003c0x0123456789abcdef0123456789abcdef01234567@testnet.ethereum\u003e",
            "message-id": "002a"
          },
          "body": "Hi Rob\r\n\r\nI sent you a mailchain message\r\n\r\nTim\r\n\r\n\u003e",
          "subject": "Welcome to Mailchain!",
          "status": "ok",
          "status-code": "",
          "read": false
        }
      ]
    }
  }

  public inboundMessage(): any {
    return {
      "headers": {
        "date": "2019-06-07T14:53:36Z",
        "from": "\u003c0x0123456789012345678901234567890123456789@testnet.ethereum\u003e",
        "to": "\u003c0x0123456789abcdef0123456789abcdef01234567@testnet.ethereum\u003e",
        "message-id": "0020c",
        "content-type": "text/plain; charset=\"UTF-8\""
      },
      "body": "A body",
      "subject": "Mailchain Test!",
      "status": "ok",
      "status-code": "",
      "read": true,
      "senderIdenticon": ""
    }
  }

  public senderAddressServerResponse(): any {
    return {
      "addresses":[
        "92D8F10248C6A3953CC3692A894655AD05D61EFB", // uppercase
        "d5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6" // lowercase
      ]      
    }
  };

  public senderAddresses(): Array<any> {
    return [
      "0x92d8f10248c6a3953cc3692a894655ad05d61efb",
      "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6"
    ]
  }

  public senderAddressesObserveResponse() {
    return {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://127.0.0.1:8080/api/addresses",
      "ok": true,
      "type": 4,
      "body": {
        "addresses": [
          "0x92d8f10248c6a3953cc3692a894655ad05d61efb",
          "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6"
        ]
      }
    }
  }

  public senderAddressesObserveResponseNoAddress() {
    return {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://127.0.0.1:8080/api/addresses",
      "ok": true,
      "type": 4,
      "body": {
        "addresses": [ ]
      }
    }
  }

  public getApiAvailabilitySuccess() {
    return {
      "addresses": 2,
      "status": "ok",
      "code": 200,
      "message": "OK"
    }
  }

  public getApiAvailabilitySuccessNoAddresses() {
    return {
      "addresses": 0,
      "status": "ok",
      "code": 200,
      "message": "OK"
    }
  }

  public getApiAvailabilityConnectionRefused() {
    return {
      "addresses": 0,
      "status": "error",
      "code": 0,
      "message": "Http failure response for http://127.0.0.1:8080/api/addresses: 0 Unknown Error"
    }
  }
  public getApiAvailabilityErrorUnknown() {
    return {
      "addresses": 0,
      "status": "error",
      "code": 62,
      "message": "Http failure response for http://127.0.0.1:8080/api/addresses: 62 Unknown Error"
    }
  }

  public apiVersionInfoOutdated(){
    return {
      "status": "outdated",
      "errors": 0,
      "release-error": 0,
      "release-error-message": "",
      "release-error-status": undefined,
      "release-version": "1.4.2",
      "client-error": 0,
      "client-error-message": "",
      "client-error-status": undefined,
      "client-version": "1.4.1",
    }
  }

  public apiVersionInfoReleaseError(){
    return {
      "status": "ok",
      "errors": 1,
      "release-error": 1,
      "release-error-message": "5 Some Release Error",
      "release-error-status": 5,
      "release-version": "unknown",
      "client-version": "0.0.35",
      "client-error": 0,
      "client-error-message": "",
      "client-error-status": undefined,
    }
  }

  public apiVersionInfoClientError(){
    return {
      "status": "ok",
      "errors": 1,
      "release-error": 0,
      "release-error-message": "",
      "release-error-status": undefined,
      "release-version": "1.4.2",
      "client-error": 1,
      "client-error-message": "7 Some Client Error",
      "client-error-status": 7,
      "client-version": "unknown",
    }
  }

  public protocolsServerResponse(): any {
    return {
      "protocols":
        [{ "name": "ethereum", "networks": [{ "name": "goerli", "id": "" }, { "name": "kovan", "id": "" }, { "name": "mainnet", "id": "" }, { "name": "rinkeby", "id": "" }, { "name": "ropsten", "id": "" }] }, { "name": "substrate", "networks": [{ "name": "edgeware-testnet", "id": "42" }] }]
    }
  }

  public versionServerResponse(): any {
    return {
      "version":"0.0.34","commit":"none","time":"unknown"
    }
  }

  public networkList(): any {
    return [
      { label: "goerli", value: "goerli"}, 
      { label: "kovan", value: "kovan"}, 
      { label: "mainnet", value: "mainnet"}, 
      { label: "rinkeby", value: "rinkeby"}, 
      { label: "ropsten", value: "ropsten"},
      // { label: "edgeware-testnet", value: "edgeware-testnet"}
    ]
  }

  public currentWebProtocolsList(): any {
    return [
      { label: "http", value: "http"}, 
      { label: "https", value: "https"}, 
    ]
  }

  public resolveNameResponse(): any {
    return {
      "address": "0x0000000000000000000000000000000000000022"
    }
  }

  public resolveAddressResponse(): any {
    return {
      "name":"mailchain.eth"
    }
  }

}

