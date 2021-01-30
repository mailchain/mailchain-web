export class OutboundMail {
  public message: any = {
    "body": "",
    "headers": {
      "from": "",
      "reply-to": "",
      "to": ""
    },
    "public-key": "",
    "public-key-encoding": "",
    "public-key-kind": "",
    "subject": ""
  };
  public "envelope": string = "";
  public "encryption-method-name": string = "aes256cbc";
  public "content-type": string = "text/plain; charset=\"UTF-8\"";
}

