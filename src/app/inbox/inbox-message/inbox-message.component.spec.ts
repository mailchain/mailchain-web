import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxMessageComponent } from './inbox-message.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('InboxMessageComponent', () => {

  let component: InboxMessageComponent;
  let fixture: ComponentFixture<InboxMessageComponent>;
  let mailchainTestService: MailchainTestService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxMessageComponent,
      ],
      providers: [],
      imports: [
        ModalModule.forRoot(),
        RouterTestingModule
      ]
    })
    .compileComponents();
    mailchainTestService = TestBed.get(MailchainTestService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxMessageComponent);
    component = fixture.componentInstance;

    component.currentMessage = mailchainTestService.inboundMessage();

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('returnToInboxMessages', () => {
    it('should call goToInboxMessages.emit() to change the view to  "messages"', () => {
      spyOn(component.goToInboxMessages,'emit')

      component.returnToInboxMessages()
      expect(component.goToInboxMessages.emit).toHaveBeenCalledWith('')
    })  
  });

  describe('replyToMessage', () => {
    it('should call replyToMessage.emit() to change the view to "message" with the currentMessage', () => {
      spyOn(component.replyToMessage,'emit')

      component.replyToMsg()
      expect(component.replyToMessage.emit).toHaveBeenCalledWith(component.currentMessage)
    })
  });

});
