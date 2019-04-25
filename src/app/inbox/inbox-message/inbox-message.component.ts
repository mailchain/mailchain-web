import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InboundMail } from 'src/app/models/inbound-mail';

@Component({
  selector: '[inbox-message]',
  templateUrl: './inbox-message.component.html',
  styleUrls: ['./inbox-message.component.scss']
})
export class InboxMessageComponent {
  @Input() currentMessage: InboundMail = new InboundMail;
  @Input() inboxMessages: Array<any> = [];
  @Output() goToInboxMessages = new EventEmitter();
  @Output() replyToMessage = new EventEmitter();
  
  /**
   * Go back to the inbox-messages view
   */
  public returnToInboxMessages(): void {
    this.goToInboxMessages.emit('');
  }


  replyToMsg(): void {
    this.replyToMessage.emit(this.currentMessage);
  }

}
