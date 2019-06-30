import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxMessagesComponent } from './inbox-messages.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/services/helpers/http-helpers/http-helpers.service';

describe('InboxMessagesComponent', () => {
  let component: InboxMessagesComponent;
  let fixture: ComponentFixture<InboxMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxMessagesComponent
      ],
      providers: [
        HttpHelpersService,
      ],
      imports: [
        FormsModule,
        HttpClientModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxMessagesComponent);
    component = fixture.componentInstance;
    component.currentAccount = "";
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
