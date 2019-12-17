import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-connectivity-error',
  templateUrl: './modal-connectivity-error.component.html',
  styleUrls: ['./modal-connectivity-error.component.scss']
})
export class ModalConnectivityErrorComponent {
  @Input() errorTitle: string;
  @Input() errorMessage: string;

  constructor(public bsModalRef: BsModalRef) { }

}
