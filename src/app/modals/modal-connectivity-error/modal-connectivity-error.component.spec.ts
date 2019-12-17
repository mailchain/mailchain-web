import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConnectivityErrorComponent } from './modal-connectivity-error.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';

describe('ModalConnectivityErrorComponent', () => {
  let component: ModalConnectivityErrorComponent;
  let fixture: ComponentFixture<ModalConnectivityErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModalConnectivityErrorComponent
      ],
      providers: [
        BsModalRef
      ],
      imports: [
        ModalModule.forRoot(),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConnectivityErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
