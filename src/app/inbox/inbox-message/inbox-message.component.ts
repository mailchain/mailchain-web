import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[inbox-message]',
  templateUrl: './inbox-message.component.html',
  styleUrls: ['./inbox-message.component.scss']
})
export class InboxMessageComponent {
  @Input() currentMessage: any;
  @Input() inboxMessages: any;
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
