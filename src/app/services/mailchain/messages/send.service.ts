import { Injectable } from '@angular/core';
import { applicationApiConfig } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { OutboundMail } from 'src/app/models/outbound-mail';

@Injectable({
  providedIn: 'root'
})
export class SendService {
  private url = `${applicationApiConfig.mailchainNodeBaseUrl}/api`
  
  constructor(
    private http: HttpClient,
    private httpHelpersService: HttpHelpersService,
  ) { }

    /**
   * Sends a mail via the api
   * @param outboundMail an outbound mail object
   * @param network the network to send to (e.g. ropsten, mainnet etc.)
   */
  sendMail(outboundMail: OutboundMail, network: string){
    var chain = "ethereum"
    var url = `${this.url}/${chain}/${network}/messages/send`
    var body = outboundMail
    var httpOptions = this.httpHelpersService.getHttpOptions()
    
    return this.http.post(url, body, httpOptions);
  }

}
