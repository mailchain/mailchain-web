import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';

@Injectable({
  providedIn: 'root'
})
export class EnvelopeService {

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
   * Get and return the available envelope(s)
   */
  async getEnvelope() {

    let envelopes = await this.http.get<any[]>(
      this.url + `/envelope`
      // TODO handle failure
    ).toPromise();
    return envelopes
  }
}
