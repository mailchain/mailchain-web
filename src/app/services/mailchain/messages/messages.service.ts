import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private url: string
  private protocol: string
  
  constructor(
    private http: HttpClient,
    private httpHelpersService: HttpHelpersService,
    private localStorageServerService: LocalStorageServerService,
    private localStorageProtocolService: LocalStorageProtocolService,
  ) {
    this.initServerDetails()
  }

  /**
   * Initialize URL from local storage
   */
  initServerDetails(){
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
    this.protocol = this.localStorageProtocolService.getCurrentProtocol()
  }

    /**
   * Gets decrypted messages from api
   */
  getMessages(rcptAddress: string, network: string): Observable<any> {
    var httpOptions = this.httpHelpersService.getHttpOptions([
      ['protocol',this.protocol],
      ['network',network],
      ['address',rcptAddress],
    ])

    return this.http.get(
      `${this.url}/messages`,
      httpOptions
    );
  };

}
