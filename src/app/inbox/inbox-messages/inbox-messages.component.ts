import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { MailchainService } from 'src/app/services/mailchain/mailchain.service';
import { ReadService } from 'src/app/services/mailchain/messages/read.service';
import { InboundMail } from 'src/app/models/inbound-mail';
import { SearchPipe } from 'src/app/pipes/search-pipe/search-pipe.pipe';
import { AddressPipe } from 'src/app/pipes/address-pipe/address-pipe.pipe';

@Component({
  selector: '[inbox-messages]',
  templateUrl: './inbox-messages.component.html',
  styleUrls: ['./inbox-messages.component.scss'],
  providers: [ SearchPipe, AddressPipe ]
})
export class InboxMessagesComponent implements OnInit, OnChanges {
  @Input() messagesLoaded: boolean;
  @Input() currentAccount: string;
  @Input() inboxMessages: Array<any>;
  
  @Output() openMessage = new EventEmitter();
  @Output() inboxCounter = new EventEmitter<any>();
  
  public currentAccountInboxMessages: Array<any> = [];
  public searchText: string = '';

  constructor(
    private mailchainService: MailchainService,
    private readService: ReadService,
    private searchPipe: SearchPipe,
    private addressPipe: AddressPipe,
  ) {
  }

  emitInboxCount(addresses: Array<any>){
    
    addresses.forEach(address => {
      // emit message count for inbox component
      var inboxCount = 0
      var _this = this
      this.mailchainService.dedupeMessagesByIds(this.inboxMessages).map(function(msg) {        
        var addr = _this.parseAddressFromMailchain(msg["headers"]["to"]).toLowerCase()
        
        if (addr.includes(address.toLowerCase()) && !msg.read) {          
          ++inboxCount
        }
      });
      
      this.inboxCounter.emit([address,inboxCount]);  
    });
    
  }

  /**
   * 
   * @param decryptedMsg 
   */
  addMailToInboxMessages(decryptedMsg){  
    decryptedMsg.senderIdenticon = this.generateIdenticon(decryptedMsg.headers.from)
    var msg = {
      ...new InboundMail,
      ...decryptedMsg
    }
    this.inboxMessages.push(msg)
  }

  openMail(mail: any): void {
    this.readService.markRead(mail["headers"]["message-id"]).subscribe(res => {
      mail.read = true;
      this.openMessage.emit(mail);
      this.emitInboxCount([this.parseAddressFromMailchain(mail["headers"]["to"])])
    })
  }

  private generateIdenticon(address){
    return this.mailchainService.generateIdenticon(address)
  }
  
  private parseAddressFromMailchain(address){
    return this.mailchainService.parseAddressFromMailchain(address)
  }

  /**
   * Toggles a message `selected` attribute 
   * @param message a message 
   */
  public selectMail(message: any): void {
    message.selected = message.selected ? false : true;
  }

  /**
   * Selects all messages in the current selected address
   */
  public selectAll(): void {
    for (var mail of this.currentAccountInboxMessages) {
      mail.selected = true;
    }
  }
  
  /**
   * Selects no messages
   * NOTE: This de-selects all inbox messages, not just the current selected address.
   */
  public selectNone(): void {
    for (var mail of this.inboxMessages) {
      mail.selected = false;
    }
  }

  /**
   * Selects the `read` messages of the current selected address
  */
  public selectRead(): void {
    this.selectNone();
    this.currentAccountInboxMessages.filter(mail => mail.read).forEach(mail => mail.selected = true);
  }

  /**
   * Selects the `unread` messages of the current selected address
  */
  public selectUnread(): void {
    this.selectNone();
    this.currentAccountInboxMessages.filter(mail => !mail.read).forEach(mail => mail.selected = true);
  }

  /**
   * Marks the currently selected messages as `read`.
   */
  public markSelectedAsRead(): void {    
    this.currentAccountInboxMessages.filter(message => message.selected).forEach(msg => {
      var rcpt = this.parseAddressFromMailchain(msg["headers"]["to"])
      // @TODO Add error handling
      this.readService.markRead(msg["headers"]["message-id"]).subscribe(res => {
        msg.read = true;
        this.emitInboxCount([rcpt]);
      })
    });
  }

  /**
   * Marks the currently selected messages as `unread`.
   */
  markSelectedAsUnread(): void {
    this.inboxMessages.filter(message => message.selected).forEach(msg => {
      var rcpt = this.parseAddressFromMailchain(msg["headers"]["to"])
      // @TODO Add error handling
      this.readService.markUnread(msg["headers"]["message-id"]).subscribe(res => {
        msg.read = false;
        this.emitInboxCount([rcpt]);
      })
    });
  }


  async ngOnInit(): Promise<void> {
    this.getCurrentAccountInboxMessages()
  }

  /**
   * Get the inbox messages, filtered by 'currently selected account' > 'searchtext'.
   * Dedupe message array - workaround for dupe messages @TODO: waiting on dupe bugfix in mailchain
   */
  getCurrentAccountInboxMessages(){    
    var inboxMessagesFilteredByAddress = this.addressPipe.transform(
      this.inboxMessages,
      this.currentAccount
    )
    var inboxMessagesFilteredByAddressSearch:Array<any> = this.searchPipe.transform(
      inboxMessagesFilteredByAddress,
      this.searchText
    )
    this.currentAccountInboxMessages = []
    // Dedupe messages
    this.currentAccountInboxMessages = this.mailchainService.dedupeMessagesByIds(inboxMessagesFilteredByAddressSearch)

  }

  async ngOnChanges(event): Promise<void> {
    // Handle resetting the selected mails
    if ( 'currentAccount' in event) {
      this.selectNone()
    }
    this.getCurrentAccountInboxMessages()
  }

}
