import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { InboundMail } from 'src/app/models/inbound-mail';
import { NameserviceService } from 'src/app/services/mailchain/nameservice/nameservice.service';
import { MailchainService } from 'src/app/services/mailchain/mailchain.service';

@Component({
  selector: '[inbox-message]',
  templateUrl: './inbox-message.component.html',
  styleUrls: ['./inbox-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InboxMessageComponent implements OnInit {
  @Input() currentMessage: InboundMail = new InboundMail;
  @Input() inboxMessages: Array<any> = [];
  @Input() currentProtocol: Array<any> = [];
  @Input() currentNetwork: Array<any> = [];
  @Output() goToInboxMessages = new EventEmitter();
  @Output() replyToMessage = new EventEmitter();

  public messageNameRecords = {}

  constructor(
    private nameserviceService: NameserviceService,
    private mailchainService: MailchainService,
  ) { }
  /**
   * Go back to the inbox-messages view
   */
  public returnToInboxMessages(): void {
    this.goToInboxMessages.emit('');
  }

  ngOnInit() {
    this.resolveNamesFromMessage()
    this.getViewForContentType()
  }

  /**
   * replyToMsg message when reply action is taken so the compose message knows which message is being replied to.
   */
  replyToMsg(): void {
    this.replyToMessage.emit(this.currentMessage);
  }

  /**
   * resolveMessageNameRecords resolves name for a given address
   * Sets the name corresponding to messageNameRecords
   * @param addr address in format 0x1234...1234
   */
  private resolveMessageNameRecords(addr) {
    this.nameserviceService.resolveAddress(
      this.currentProtocol,
      this.currentNetwork,
      addr
    ).subscribe(res => {
      if (res['ok']) {
        this.messageNameRecords[addr] = res['body']['name']
      }
    })
  }

  /**
   * resolveNamesFromMessages looks up the 'to' and 'from' name
   * records according to the currentNetwork and currentProtocol
   */
  private resolveNamesFromMessage() {
    [
      this.currentMessage["headers"]["to"],
      this.currentMessage["headers"]["from"]
    ].forEach(element => {
      let parsedAddr = this.parseAddressFromMailchain(element)
      this.resolveMessageNameRecords(parsedAddr)
    });

  }

  /**
   * Returns the extracted public address from mailchain formatted address
   * @param address formatted <0x...@network.protocol> address
   */
  public parseAddressFromMailchain(address) {
    return this.mailchainService.parseAddressFromMailchain(address)
  }

  /**
   * getViewForContentType: Returns correct view for content-type
   */
  private getViewForContentType() {
    let ct = this.currentMessage.headers["content-type"]

    switch (ct) {
      case 'plaintext':
        this.addMessageText()
        break;
      case 'text/html; charset="UTF-8"':
        this.addMessageIframe()
        break;
      default:
        this.addMessageText()
        break;
    }
    return this.mailchainService.getContentTypeForView(ct)
  }

  /** addMessageIframe: Creates iframe containing message and adds it to message-frame */
  public addMessageIframe() {
    var messageFrame = document.getElementById('message-frame')

    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("srcdoc", this.currentMessage.body);
    ifrm.setAttribute("frameborder", "0");
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    ifrm.classList.add("message-body-html")

    messageFrame.appendChild(ifrm);
  }

  /** Creates message div & pre containing message and adds it to message-frame */
  public addMessageText() {
    var messageFrame = document.getElementById('message-frame')

    var divMessage = document.createElement('div')
    divMessage.classList.add("message-body")

    var preMessage = document.createElement('pre')
    divMessage.classList.add("pre-inherit")
    divMessage.innerText = this.currentMessage.body

    divMessage.appendChild(preMessage)
    messageFrame.appendChild(divMessage)
  }

}
