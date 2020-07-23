import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class ProtocolsService {

  private url: string

  constructor(
    private http: HttpClient,
    private localStorageServerService: LocalStorageServerService,
  ) {
    this.initUrl()
  }

  /**
   * Initialize URL from local storage
   */
  initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
  }

  /**
   * Get and return the protocols configured on the api application
   */
  getProtocols() {
    return this.http.get(this.url + `/protocols`);
  }

  /**
   * Helper function to get and return the protocols by name
   */
  async getProtocolsByName() {
    let protocols: Array<any>
    await this.getProtocols().toPromise().then(res => {
      protocols = res["protocols"].map(el => el["name"])
    })
    return protocols
  }

}
