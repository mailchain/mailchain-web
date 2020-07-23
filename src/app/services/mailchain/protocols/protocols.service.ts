import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class ProtocolsService {

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
  initUrl() {
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api/protocols`
  }

  /**
   * Get and return the protocols configured on the api application
   */
  getProtocols() {
    return this.http.get(this.url);
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

  /**
   * Returns the protocols response with status codes
   */
  public getProtocolsResponse() {
    var httpOptions = this.httpHelpersService.getHttpOptions()

    return this.http.get(
      this.url,
      httpOptions
    )
  }
}
