import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Mail } from 'src/app/models/mail';
import { OutboundMail } from 'src/app/models/outbound-mail';
import { MailchainService } from 'src/app/services/mailchain/mailchain.service';
import { SendService } from 'src/app/services/mailchain/messages/send.service';
import { PublicKeyService } from 'src/app/services/mailchain/public-key/public-key.service';

@Component({
  selector: '[inbox-compose]',
  templateUrl: './inbox-compose.component.html',
  styleUrls: ['./inbox-compose.component.scss']
})

export class InboxComposeComponent implements OnInit {
  @Input() currentMessage: any;
  @Input() currentNetwork: string;
  
  @Output() openMessage = new EventEmitter();
  @Output() goToInboxMessages = new EventEmitter();
  
  public model = new Mail()
  public fromAddresses: Array<any> = []
  public sendMessagesDisabled: boolean = false;

  constructor(
    private mailchainService: MailchainService,
    private sendService : SendService,
    private publicKeyService: PublicKeyService,
  ) { }

  private initMail() {
    this.model.to = ""
    this.model.from = ""
    this.model.subject = ""
    this.model.body = ""
  }

  /**
   * Sets the available from addresses
   */
  private async setFromAddressList(){
    this.fromAddresses = await this.publicKeyService.getPublicSenderAddresses();    
  }
  
  /**
   * Go back to the inbox-messages view
   */
  public returnToInboxMessages(): void {
    this.goToInboxMessages.emit('');
  }

  /**
   * Go back to the inbox-messages view
   */
  public returnToMessage(): void {
    if (this.currentMessage == undefined) {
      this.returnToInboxMessages();
    } else {
      this.openMessage.emit(this.currentMessage);
    }
  }

  /**
   * Sets the first available address in the `from` dropdown
   * -or-
   * When replying, sets the from address as the address the message was sent to
   */
  private setFirstOptionInFromAddressDropdown(){
    // Set first option in dropdown
    if ( this.fromAddresses[0] != undefined ) {
      this.model.from = this.fromAddresses[0]
    } 
  }

  /**
   * Initialise the message.
   * If it's a new message, fields will be blank.
   * -or-
   * If it's a reply, the correct fields are mapped to build the response.
   */
  async ngOnInit(): Promise<void> {
    await this.setFromAddressList()
    this.initMail()
    this.setFirstOptionInFromAddressDropdown()
    
    if ( this.currentMessage && this.currentMessage.headers ) {
      var messageFrom:    string = "",
        messageReplyTo:   string = "",
        messageDate:      string = "",
        messageTo:        string = "",
        messageSubject:   string = "",
        messageBody:      string = ""

      if (this.currentMessage.headers["from"]) {
        messageFrom = '\r\n\r\n>From: ' + this.currentMessage.headers["from"] + "\r\n"
      }
      if (this.currentMessage.headers["reply-to"]){
        messageReplyTo = '>Reply To: ' + this.currentMessage.headers["reply-to"] + "\r\n"
      }
      if (this.currentMessage.headers["date"]){
        messageDate = '>Date: ' + this.currentMessage.headers["date"] + "\r\n"
      }
      if (this.currentMessage.headers["to"]){
        messageTo = '>To: ' + this.currentMessage.headers["to"] + "\r\n"
      }
      if (this.currentMessage["subject"]){
        messageSubject = '>Subject: ' + this.currentMessage["subject"] + "\r\n" + ">" + "\r\n"
      } else {
        messageSubject = ""
      }
      if (this.currentMessage["body"]){
        messageBody = '>' + this.currentMessage["body"] 
      }
      
      var messageBody = messageBody.replace(/\r\n/g, '\r\n>');
      
      this.model.body =  messageFrom +
        messageReplyTo +
        messageDate +
        messageTo +
        messageSubject +
        messageBody
      
      this.model.to = this.mailchainService.parseAddressFromMailchain(this.currentMessage.headers["from"])
      this.model.from = this.mailchainService.parseAddressFromMailchain(this.currentMessage.headers["to"])
      this.model.subject = this.addRePrefixToSubject(this.currentMessage["subject"])
    } 
  }

  /**
   * Checks for 'Re: ' on the subject and adds it if it is not there already.
   * @param subject the message subject
   */
  private addRePrefixToSubject(subject: string) {
    if (subject.startsWith("Re: ") ) {
      return subject
    } else {
      return "Re: " + subject
    }
  };
  
  /**
  * onSubmit sends email to the local service. It includes the reset form to handle errors and resets.
  * @param form is the form being sent to the local service
  */
  public onSubmit(form: NgForm) {  
    this.sendMessagesDisabled = true
    var self = this
    this.publicKeyService.getPublicKeyFromAddress(
      this.model.to,
      this.currentNetwork
    ).subscribe(res => {

      this.model.publicKey = res["public_key"]
      var outboundMail = this.generateMessage(this.model)
            
      this.sendMessage(outboundMail).subscribe(res => {
        self.initMail();
        self.returnToInboxMessages();
      });
    })
  }

  /**
   * Builds the OutboundMail object for sending
   * @param mailObj The form Mail object
   */
  private generateMessage(mailObj: Mail): OutboundMail {
    return this.mailchainService.generateMail(mailObj)    
  }

  /**
   * Sends the OutboundMail object on the currently selected network
   * @param outboundMail The OutboundMail object
   */
  private sendMessage(outboundMail: OutboundMail) {
    let network = this.currentNetwork
    return this.sendService.sendMail(outboundMail, network)    
  }
}

