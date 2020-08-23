import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { OutboundMail } from 'src/app/models/outbound-mail';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class SendService {
  private url: string

  constructor(
    private http: HttpClient,
    private httpHelpersService: HttpHelpersService,
    private localStorageServerService: LocalStorageServerService,
  ) {
    this.initUrl()
  }

  /**
   * Initialize URL from local storage
   */
  async initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
  }

  /**
 * Sends a mail via the api
 * @param outboundMail an outbound mail object
 * @param network the network to send to (e.g. ropsten, mainnet etc.)
 */
  sendMail(outboundMail: OutboundMail, protocol: string, network: string) {

    var url = `${this.url}/messages`
    var body = outboundMail
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol', protocol],
      ['network', network]
    ])

    return this.http.post(url, body, httpOptions);
  }

}
