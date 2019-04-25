import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxMessageComponent } from './inbox-message.component';
import { ModalModule } from 'ngx-bootstrap/modal';

describe('InboxMessageComponent', () => {
  let component: InboxMessageComponent;
  let fixture: ComponentFixture<InboxMessageComponent>;

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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
