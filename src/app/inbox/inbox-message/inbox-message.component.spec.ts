import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxMessageComponent } from './inbox-message.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { Component } from '@angular/core';
import { InboundMail } from 'src/app/models/inbound-mail';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  template: `
    <div inbox-message
      class="col-lg-8 col-xl-9 col-12"
      [currentMessage]="currentMessage"
      [inboxMessages]="inboxMessages"

      (replyToMessage)="composeMessage($event)"
      (goToInboxMessages)="changeView('messages')"
    ></div>`
})
class TestInboxMessageComponent {
  currentMessage: InboundMail = new InboundMail;
  inboxMessages: Array<any> = [];
}


describe('InboxMessageComponent', () => {

  let component: TestInboxMessageComponent;
  let fixture: ComponentFixture<TestInboxMessageComponent>;
  let mailchainTestService: MailchainTestService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxMessageComponent,
        TestInboxMessageComponent,
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
    fixture = TestBed.createComponent(TestInboxMessageComponent);
    component = fixture.componentInstance;

    component.currentMessage = mailchainTestService.inboundMessage();

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
