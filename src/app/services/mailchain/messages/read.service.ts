import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class ReadService {
  private url: string

  constructor(
    private http: HttpClient,
    private httpHelpersService: HttpHelpersService,
    private localStorageServerService: LocalStorageServerService,
  ) {
    this.initUrl()
  }

  /**
   * Marks a message as read. This is stored locally in the client
   * @param message_id The message Id to mark as read
   */
  markRead(message_id) {
    var url = this.urlHelper(message_id)
    var httpOptions = this.httpHelpersService.getHttpOptions()
    return this.http.put(url, {}, httpOptions);
  }

  /**
   * Removes the read status for a message.
   * @param message_id The message Id to mark as unread
   */
  markUnread(message_id) {
    var url = this.urlHelper(message_id)
    var httpOptions = this.httpHelpersService.getHttpOptions()

    return this.http.delete(url, httpOptions);
  }

  /**
 * Initialize URL from local storage
 */
  initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
  }

  /**
   * Inserts the message id into the api url endpoint
   * @param message_id the message id to insert into url
   */
  urlHelper(message_id) {
    return `${this.url}/messages/${message_id}/read`
  }
}
