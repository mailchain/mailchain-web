import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxComponent } from './inbox.component';
import { InboxMessagesComponent } from './inbox-messages/inbox-messages.component';
import { InboxMessageComponent } from './inbox-message/inbox-message.component';
import { InboxComposeComponent } from './inbox-compose/inbox-compose.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from '../services/helpers/http-helpers/http-helpers.service';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxComponent,
        InboxMessagesComponent,
        InboxMessageComponent,
        InboxComposeComponent,
      ],
      providers:[
        HttpHelpersService,
      ],
      imports: [
        HttpClientModule,
        ModalModule.forRoot(),
        FormsModule,
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
