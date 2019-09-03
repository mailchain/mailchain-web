export class InboundMail {
  public headers: any = {};
  public subject: string = "No Subject";
  public body: string = "";
  public read: boolean = false;
  public selected: boolean = false;
  public senderIdenticon: string = "";
  public status: string = "";
  public 'status-code': string ="";
}
