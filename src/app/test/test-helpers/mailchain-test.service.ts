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

  public sendMailResponse(): any {
    return {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null,
        "headers": {}
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://127.0.0.1:8080/api/ethereum/ropsten/messages/send",
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
        "message-id": "0020c"
      },
      "body": "",
      "subject": "Re: Mailchain Test!",
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

  public protocolsServerResponse(): any {
    return {
      "protocols": [{
          "name": "ethereum",
          "networks": ["goerli", "kovan", "mainnet", "rinkeby", "ropsten"]
        }]
    }
  }

}

