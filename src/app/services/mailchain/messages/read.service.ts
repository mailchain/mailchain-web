import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { applicationApiConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReadService {

  constructor(
    private http: HttpClient,
    private httpHelpersService: HttpHelpersService
  ) { }

  /**
   * Marks a message as read. This is stored locally in the client
   * @param message_id The message Id to mark as read
   */
  markRead(message_id) {
    var url = this.urlHelper(message_id)
    var httpOptions = this.httpHelpersService.getHttpOptions()
    return this.http.put(url, {} ,httpOptions);
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

  urlHelper(message_id){
    return `${applicationApiConfig.mailchainNodeBaseUrl}/api/messages/${message_id}/read`
  }
}
