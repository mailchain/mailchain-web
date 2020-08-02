import { TestBed } from '@angular/core/testing';

import { MailchainService } from './mailchain.service';
import { of } from 'rxjs';
import { OutboundMail } from 'src/app/models/outbound-mail';
import { Mail } from 'src/app/models/mail';
import { HttpClientModule } from '@angular/common/http';
import { NameserviceService } from './nameservice/nameservice.service';
import * as IdenticonImages from 'src/test/images.json'

describe('MailchainService', () => {
  let mailchainService: MailchainService;
  let nameserviceService: NameserviceService

  const address1 = "0x0000000000000000000000000000000000000001"
  const address2 = "0x0000000000000000000000000000000000000002"

  /**
   * Resolves address1: myname.eth
   * Throws 404 error for address2
   */
  class NameserviceServiceStub {
    resolveAddress(protocol, network, value) {
      if (value == address1) {
        return of(
          {
            "body": { "name": "myname.eth" },
            "ok": true
          }
        )
      }
      if (value == address2) {
        return of({ "status": 404 })
      }
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MailchainService,
        { provide: NameserviceService, useClass: NameserviceServiceStub },
      ]
    });

    mailchainService = TestBed.get(MailchainService);
  });

  it('should be created', () => {
    expect(mailchainService).toBeTruthy();
  });

  describe('generateIdenticon', () => {
    it('should return image resource as base64 image with Ethereum address as input', () => {
      const identiconResponse = IdenticonImages.identicon0
      const address = "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6"
      let response
      let protocol = 'ethereum'
      response = mailchainService.generateIdenticon(protocol, address)

      expect(response).toEqual(identiconResponse)
    })

    it('should return image resource as base64 image with Mailchain address as input', () => {
      const identiconResponse = IdenticonImages.identicon0
      const address = "<0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6@ropsten.ethereum>"
      let response
      let protocol = 'ethereum'
      response = mailchainService.generateIdenticon(protocol, address)

      expect(response).toEqual(identiconResponse)
    })

  })

  describe('parseAddressFromMailchain', () => {
    it('should return an Ethereum account address from a Mailchain address', () => {
      const mailchainAddress = "<0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6@ropsten.ethereum>"
      const ethereumAccountAddress = "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6"
      let protocol = 'ethereum'

      let response = mailchainService.parseAddressFromMailchain(protocol, mailchainAddress)

      expect(response).toEqual(ethereumAccountAddress)
    });

    it('should return a blank string if the Mailchain address is invalid', () => {
      const mailchainAddress = "<0x@ropsten.ethereum>"
      let protocol = 'ethereum'

      let response = mailchainService.parseAddressFromMailchain(protocol, mailchainAddress)

      expect(response).toEqual('')
    });
  })

  describe('dedupeMessagesByIds', () => {
    it('should return a deduplicated message array', () => {
      const messages = [
        {
          "headers": {
            "date": "2019-04-12T18:23:07+01:00",
            "from": "<0x0000000000000000000000000000000000000001@ropsten.ethereum>",
            "to": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",
            "message-id": "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
          },
          "subject": "No Dupe: Mail Test",
          "body": "Hi Charlotte",
          "read": true,
          "status": "ok",
          "status-code": "",
          "senderIdenticon": "data:image/png;base64,abcd="
        },
        {
          "headers": {
            "date": "2019-04-12T18:21:00+01:00",
            "from": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",
            "to": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",
            "message-id": "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002"
          },
          "subject": "Dupe: Mail Test",
          "body": "Sending to me,\n\nThis may have a duplicate",
          "read": true,
          "status": "ok",
          "status-code": "",
          "senderIdenticon": "data:image/png;base64,abcdefg="
        },
        {
          "headers": {
            "date": "2019-04-12T18:21:00+01:00",
            "from": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",
            "to": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",
            "message-id": "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002"
          },
          "subject": "Dupe: Mail Test",
          "body": "Sending to me,\n\nThis may have a duplicate",
          "read": true,
          "status": "ok",
          "status-code": "",
          "senderIdenticon": "data:image/png;base64,abcdefg="
        }
      ]
      const messagesResponse = [
        {
          "headers": {
            "date": "2019-04-12T18:23:07+01:00",
            "from": "<0x0000000000000000000000000000000000000001@ropsten.ethereum>",
            "to": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",
            "message-id": "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
          },
          "subject": "No Dupe: Mail Test",
          "body": "Hi Charlotte",
          "read": true,
          "status": "ok",
          "status-code": "",
          "senderIdenticon": "data:image/png;base64,abcd="
        },
        {
          "headers": {
            "date": "2019-04-12T18:21:00+01:00",
            "from": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",
            "to": "<0x0000000000000000000000000000000000000000@ropsten.ethereum>",
            "message-id": "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002"
          },
          "subject": "Dupe: Mail Test",
          "body": "Sending to me,\n\nThis may have a duplicate",
          "read": true,
          "status": "ok",
          "status-code": "",
          "senderIdenticon": "data:image/png;base64,abcdefg="
        }
      ]

      let response = mailchainService.dedupeMessagesByIds(messages)

      expect(messages.length).toEqual(3)
      expect(response.length).toEqual(2)
      expect(response).toEqual(messagesResponse)
    });
  })

  describe('dedupeMessagesBySender', () => {
    let address1 = "<0x0000000000000000000000000000000000000001@ropsten.ethereum>"
    let address2 = "<0x0000000000000000000000000000000000000002@ropsten.ethereum>"

    let messages = [
      { "headers": { "from": address1 } },
      { "headers": { "from": address2 } },
      { "headers": { "from": address1 } },
      { "headers": { "from": address2 } },
      { "headers": { "from": address1 } },
    ]

    it('should dedupe the senders of messages', () => {
      let res = mailchainService.dedupeMessagesBySender('ethereum', messages)
      expect(res.length).toEqual(2)
      expect(res).toEqual([
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002"
      ])
    })
  })

  describe('resolveSendersFromMessages', () => {
    let address1 = "<0x0000000000000000000000000000000000000001@ropsten.ethereum>"
    let address2 = "<0x0000000000000000000000000000000000000002@ropsten.ethereum>"

    let messages = [
      { "headers": { "from": address1 }, "status": "ok" },
      { "headers": { "from": address2 }, "status": "ok" },
    ]

    it('should handle multiple messages', () => {
      let res = mailchainService.resolveSendersFromMessages("ethereum", "testnet", messages)

      expect(res["0x0000000000000000000000000000000000000001"]).toEqual('myname.eth')
      expect(res["0x0000000000000000000000000000000000000002"]).toEqual(undefined)

    })
  })

  describe('generateMail', () => {
    const mailObject = new Mail
    mailObject["to"] = "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6"
    mailObject["from"] = "0x92d8f10248c6a3953cc3692a894655ad05d61efb"
    mailObject["subject"] = "Test message"
    mailObject["body"] = "Hi Sofia,\n\nHow are you?\n\nBest Wishes\n\nCharlotte"
    mailObject["publicKey"] = "0x69d908510e355beb1d5bf2df8129e5b6401e1969891e8016a0b2300739bbb00687055e5924a2fd8dd35f069dc14d8147aa11c1f7e2f271573487e1beeb2be9d0"
    mailObject["publicKeyEncoding"] = "hex/0x-prefix"
    mailObject["publicKeyKind"] = "secp256k1"
    mailObject["supportedEncryptionTypes"] = ["aes256cbc", "noop"]

    let outboundMailObject = new OutboundMail
    outboundMailObject["message"] = {
      "body": "Hi Sofia,\n\nHow are you?\n\nBest Wishes\n\nCharlotte",
      "headers": {
        "from": "0x92d8f10248c6a3953cc3692a894655ad05d61efb",
        "reply-to": "0x92d8f10248c6a3953cc3692a894655ad05d61efb",
        "to": "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6"
      },
      "public-key": "0x69d908510e355beb1d5bf2df8129e5b6401e1969891e8016a0b2300739bbb00687055e5924a2fd8dd35f069dc14d8147aa11c1f7e2f271573487e1beeb2be9d0",
      "public-key-encoding": "hex/0x-prefix",
      "public-key-kind": "secp256k1",
      "subject": "Test message",
    }
    outboundMailObject["envelope"] = "0x05"
    outboundMailObject["encryption-method-name"] = "aes256cbc"

    it('should return valid outputs when given a valid Mail object', () => {
      let response = mailchainService.generateMail(mailObject, "plaintext", "0x05", "ethereum")

      expect(response).toEqual(outboundMailObject)
    })
    it('should return valid content type for plaintext', () => {
      let response = mailchainService.generateMail(mailObject, "plaintext", "0x01", "ethereum")

      expect(response["content-type"]).toEqual('text/plain; charset=\"UTF-8\"')
    })
    it('should return valid content type for html', () => {
      let response = mailchainService.generateMail(mailObject, "html", "0x01", "ethereum")

      expect(response["content-type"]).toEqual('text/html; charset=\"UTF-8\"')
    })
    xit('should specify public-key-kind as "secp256k1" if the currentProtocol is `ethereum`', () => {
      let response = mailchainService.generateMail(mailObject, "html", "0x01", "ethereum")

      // expect(response["message"]["public-key-kind"]).toBe("secp256k1")
      // TODO: alter behaviour for key handling
      expect(response["message"]["public-key-kind"]).toBe(false)
    })

    xit('should specify public-key-kind as "secp256k1" if the currentProtocol is `unknown`', () => {
      let response = mailchainService.generateMail(mailObject, "html", "0x01", "unknown")

      // expect(response["message"]["public-key-kind"]).toBe("secp256k1")
      // TODO: alter behaviour for key handling
      expect(response["message"]["public-key-kind"]).toBe(false)
    })

    xit('should specify public-key-kind as "sr25519" if the currentProtocol is `substrate`', () => {
      let response = mailchainService.generateMail(mailObject, "html", "0x01", "substrate")

      // expect(response["message"]["public-key-kind"]).toBe("sr25519")
      // TODO: alter behaviour for key handling
      expect(response["message"]["public-key-kind"]).toBe(false)
    })
  })

  describe('filterMessages', () => {
    // id 00: read & status ok;
    //        address 1
    // id 01: read & status error;
    //        address 2
    // id 02: unread & status ok;
    //        address 1
    // id 03: unread & status error;
    //        address 2
    const protocol = 'ethereum'
    const messages = [
      {
        "headers": {
          "to": "<0x0000000000000000000000000000000000000001@ropsten.ethereum>",
        },
        "read": true,
        "status": "ok",
      },
      {
        "headers": {
          "to": "<0x0000000000000000000000000000000000000002@ropsten.ethereum>",
        },
        "read": true,
        "status": "error",
      },
      {
        "headers": {
          "to": "<0x0000000000000000000000000000000000000001@ropsten.ethereum>",
        },
        "read": false,
        "status": "ok",
      },
      {
        "headers": {
          "to": "<0x0000000000000000000000000000000000000002@ropsten.ethereum>",
        },
        "read": false,
        "status": "error",
      }
    ]
    const address1 = "0x0000000000000000000000000000000000000001"
    const address2 = "0x0000000000000000000000000000000000000002"

    it('should return messages with a matching status to the options["status"] value', () => {
      expect(mailchainService.filterMessages(protocol, messages, { status: "ok" })).toEqual([messages[0], messages[2]])
      expect(mailchainService.filterMessages(protocol, messages, { status: "error" })).toEqual([messages[1], messages[3]])
    })
    it('should return messages with a readState to the options["readState"] value', () => {
      expect(mailchainService.filterMessages(protocol, messages, { readState: true })).toEqual([messages[0], messages[1]])
      expect(mailchainService.filterMessages(protocol, messages, { readState: false })).toEqual([messages[2], messages[3]])
    })
    it('should return messages with a readState to the options["readState"] value', () => {
      expect(mailchainService.filterMessages(protocol, messages, { status: "ok", readState: true })).toEqual([messages[0]])
      expect(mailchainService.filterMessages(protocol, messages, { status: "ok", readState: false })).toEqual([messages[2]])
      expect(mailchainService.filterMessages(protocol, messages, { status: "error", readState: true })).toEqual([messages[1]])
      expect(mailchainService.filterMessages(protocol, messages, { status: "error", readState: false })).toEqual([messages[3]])
    })
    it('should return messages with a TO adddress matching the options["headersTo"] value', () => {
      expect(mailchainService.filterMessages(protocol, messages, { headersTo: address1 })).toEqual([messages[0], messages[2]])
      expect(mailchainService.filterMessages(protocol, messages, { headersTo: address2 })).toEqual([messages[1], messages[3]])
    })
    it('should return messages with a TO adddress matching the options["headersTo"] value', () => {
      expect(mailchainService.filterMessages(protocol, messages, { status: "ok", readState: true, headersTo: address1 })).toEqual([messages[0]])
      expect(mailchainService.filterMessages(protocol, messages, { status: "ok", readState: false, headersTo: address1 })).toEqual([messages[2]])
      expect(mailchainService.filterMessages(protocol, messages, { status: "error", readState: true, headersTo: address2 })).toEqual([messages[1]])
      expect(mailchainService.filterMessages(protocol, messages, { status: "error", readState: false, headersTo: address2 })).toEqual([messages[3]])
    })
    it('should handle messages returned as null', () => {
      expect(mailchainService.filterMessages(protocol, null, { status: "ok" })).toEqual([])
      expect(mailchainService.filterMessages(protocol, null, { readState: true })).toEqual([])
      expect(mailchainService.filterMessages(protocol, null, { headersTo: address1 })).toEqual([])
    })
  })

  describe('validateEnsName', () => {
    it('should accept alphanumeric names', () => {
      let exps = [
        "somedomain.eth",
        "somedomain1.eth",
        "s0m3d0m41n.eth",
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(true)
      })
    })
    it('should accept alphanumeric subdomains', () => {
      let exps = [
        "somedomain.domain.eth",
        "somedomain1.domain.eth",
        "s0m3d0m41n.domain.eth",
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(true)
      })
    })
    it('should be valid if tld is 2 chars or more', () => {
      let exps = [
        "somedomain.et",
        "somedomain.eth",
        "somedomain.funkytld",
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(true)
      })
    })
    it('should be valid if it is a subdomain', () => {
      let exps = [
        "subdomain.somedomain.et",
        "subdomain.somedomain.eth",
        "subdomain.somedomain.funkytld",
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(true)
      })
    })
    it('should be valid if it is has a hyphen in the domain', () => {
      let exps = [
        "some-domain.eth",
        "subdomain.some-domain.eth"
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(true)
      })
    })
    it('should be valid if it is has a hyphen in the subdomain', () => {
      let exps = [
        "sub-domain.somedomain.eth",
        "sub-domain.some-domain.eth"
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(true)
      })
    })

    it('should return false if there is an invalid character', () => {
      let exps = [
        "some_domain.eth",
        "some*domain.eth",
        "some+domain.eth",
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(false)
      })
    })
    it('should return false if tld extension is less than 2 chars', () => {
      let exp = "somedomain.e"
      expect(mailchainService.validateEnsName(exp)).toBe(false)
    })
    it('should return false if there is no tld extension', () => {
      let exp = "somedomain"
      expect(mailchainService.validateEnsName(exp)).toBe(false)
    })
    it('should return false if there are 2 dots consecutively (..)', () => {
      let exps = [
        "somedomain..eth",
        "subdomain.somedomain..eth",
        "subdomain..somedomain.eth",
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(false)
      })
    })
    it('should return false if there are non-alphabet characters in the tld', () => {
      let exps = [
        "somedomain.3th",
        "subdomain.somedomain.3th",
        "subdomain..somedomain.e2h",
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(false)
      })
    })
    it('should return false if the name starts with a hyphen (-)', () => {
      let exps = [
        "-somedomain.eth",
        "subdomain.-somedomain.eth"
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEnsName(exp)).toBe(false)
      })
    })
    it('should return false if the subdomain starts with a hyphen (-)', () => {
      let exp = "-subdomain.somedomain.eth"
      expect(mailchainService.validateEnsName(exp)).toBe(false)
    })
  })

  describe('validateEthAddress', () => {
    it('should return true forvalid ethereum addresses', () => {
      let exps = [
        "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6",
        "0x0000000000000000000000000000000000000000",
        "0xD5AB4CE3605cd590db609b6b5c8901fdb2ef7fe6",
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEthAddress(exp)).toBe(true)
      })
    })
    it('should return false if the ethereum address does not start with 0x', () => {
      let exps = [
        "00d5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6", // 0x >> 00
        "0000000000000000000000000000000000000000",   // no 0x
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEthAddress(exp)).toBe(false)
      })
    })
    it('should return false if the ethereum address is not the right length', () => {
      let exps = [
        "0xd5ab4ce3605cd590db609b6b5c8901fdb2ef7f",     //-2
        "0x000000000000000000000000000000000000000",    //-1
        "0xD5AB4CE3605cd590db609b6b5c8901fdb2ef7fe66",  // +1
      ]
      exps.forEach(exp => {
        expect(mailchainService.validateEthAddress(exp)).toBe(false)
      })
    })
    it('should return false if the ethereum address contains non-hex values', () => {
      let exp = "0xg5ab4ce3605cd590db609b6b5c8901fdb2ef7fe6"
      expect(mailchainService.validateEthAddress(exp)).toBe(false)
    })
  });

  describe('getContentTypeForView', () => {
    it('should return html for contentType: text/html', () => {
      expect(mailchainService.getContentTypeForView("text/html; charset=\"UTF-8\"")).toBe("html")
    });
    it('should return html for contentType: text/html', () => {
      expect(mailchainService.getContentTypeForView("text/html; charset='UTF-8'")).toBe("html")
    });
    it('should return plaintext for contentType: text/plain', () => {
      expect(mailchainService.getContentTypeForView("text/plain; charset=\"UTF-8\"")).toBe("plaintext")
    });
    it('should return plaintext for contentType: text/plain', () => {
      expect(mailchainService.getContentTypeForView("text/plain; charset='UTF-8'")).toBe("plaintext")
    });
    it('should return plaintext for unknown contentType', () => {
      expect(mailchainService.getContentTypeForView("text/crazy; charset='UTF-?'")).toBe("plaintext")
    });

  });


});
