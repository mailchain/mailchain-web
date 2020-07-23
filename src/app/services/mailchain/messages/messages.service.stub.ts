import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesServiceStub {

  constructor(
    private mailchainTestService: MailchainTestService
  ) {
  }

  getMessages(rcptAddress: string, protocol: string, network: string): Observable<any> {
    let messages = this.mailchainTestService.messagesResponse
    return of(messages)
  };

}
