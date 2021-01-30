import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadServiceStub {

  constructor(
  ) {
  }

  markRead(message_id) {
    return of(["ok"])
  }

  markUnread(message_id) {
    return of(["ok"])
  }

  initUrl() {
  }

  urlHelper(message_id) {
  }
}
