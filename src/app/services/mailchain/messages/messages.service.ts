import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private url: string

  constructor(
    private http: HttpClient,
    private httpHelpersService: HttpHelpersService,
    private localStorageServerService: LocalStorageServerService,
  ) {
    this.initServerDetails()
  }

  /**
   * Initialize URL from local storage
   */
  async initServerDetails() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
  }

  /**
 * Gets decrypted messages from api
 */
  getMessages(rcptAddress: string, protocol: string, network: string): Observable<any> {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', protocol],
      ['network', network],
      ['address', rcptAddress],
    ])

    return this.http.get(
      `${this.url}/messages`,
      httpOptions
    );
  };

}
