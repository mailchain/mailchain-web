import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxComposeComponent } from './inbox-compose.component';

describe('InboxComposeComponent', () => {
  let component: InboxComposeComponent;
  let fixture: ComponentFixture<InboxComposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboxComposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
