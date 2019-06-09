import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxMessageComponent } from './inbox-message.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

describe('InboxMessageComponent', () => {
  let component: InboxMessageComponent;
  let fixture: ComponentFixture<InboxMessageComponent>;
  let mailchainTestService: MailchainTestService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxMessageComponent
      ],
      providers: [],
      imports: [
        ModalModule.forRoot()
      ]
    })
    .compileComponents();
    mailchainTestService = TestBed.get(MailchainTestService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxMessageComponent);
    component = fixture.componentInstance;
    component.currentMessage = mailchainTestService.inboundMessage()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
