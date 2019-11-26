export class OutboundMail {
  public message: any = {
    "body": "",
    "headers": {
      "from": "",
      "reply-to": "",
      "to": ""
    },
    "public-key": "",
    "subject": ""
  };
  public envelope: string = "0x01";
  public "encryption-method-name": string = "aes256cbc";
}

