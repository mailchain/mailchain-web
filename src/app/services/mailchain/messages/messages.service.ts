import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { LocalStorageProtocolService } from '../../helpers/local-storage-protocol/local-storage-protocol.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private url: string
  private protocol: string
  
  constructor(
    private http: HttpClient,
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
    return this.http.get(
      `${this.url}/${this.protocol}/${network}/address/${rcptAddress}/messages`
    );
  };

}
