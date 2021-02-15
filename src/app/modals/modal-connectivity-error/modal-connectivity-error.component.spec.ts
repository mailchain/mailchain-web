import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalConnectivityErrorComponent } from './modal-connectivity-error.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';

describe('ModalConnectivityErrorComponent', () => {
  let component: ModalConnectivityErrorComponent;
  let fixture: ComponentFixture<ModalConnectivityErrorComponent>;

  beforeEach(waitForAsync(() => {
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
