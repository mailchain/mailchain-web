import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { applicationApiConfig } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private url = `${applicationApiConfig.mailchainNodeBaseUrl}/api/ethereum`
  
  constructor(
    private http: HttpClient,
  ) { }

    /**
   * Gets decrypted messages from api
   */
  getMessages(rcptAddress: string, network: string): Observable<any> {
    return this.http.get(
      `${this.url}/${network}/address/${rcptAddress}/messages`
    );
  };

}
