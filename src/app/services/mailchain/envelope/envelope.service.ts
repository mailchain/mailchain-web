import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class EnvelopeService {

  private url: string
  private protocol: string
  private network: string

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
    this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
  }

  /**
   * Get and return the available envelope(s)
   */
  async getEnvelope() {

    var envelopes = []
    let res = await this.http.get(
      this.url + `/envelope`
      // TODO handle failure
    ).toPromise();
    res["body"]["envelope"].forEach(envelope => {
      envelopes.push(JSON.parse(envelope))
      console.log(envelopes);

    });
    return envelopes
  }
}
