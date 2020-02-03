export class OutboundMail {
  public message: any = {
    "body": "",
    "headers": {
      "from": "",
      "reply-to": "",
      "to": ""
    },
    "public-key": "",
    "public-key-encoding": "hex/0x-prefix",
    "public-key-kind": "secp256k1",
    "subject": ""
  };
  public "envelope": string = "0x01";
  public "encryption-method-name": string = "aes256cbc";
  public "content-type": string = "text/plain; charset=\"UTF-8\"";
}

