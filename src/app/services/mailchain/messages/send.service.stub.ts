import { Injectable } from '@angular/core';
import { OutboundMail } from 'src/app/models/outbound-mail';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendServiceStub {

  constructor(
  ) {
  }

  sendMail(outboundMail: OutboundMail, protocol: string, network: string) {
    return of([])
  }

}
