export class Mail {
  public to: string = "";
  public from: string = "";
  public replyTo: string = "";
  public subject: string = "";
  public body: string = "";
  public publicKey: string = "";
  public publicKeyEncoding: string = "";
  public publicKeyKind: string = "";
  public supportedEncryptionTypes: Array<any> = [];
}