import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvelopeServiceStub {
  private envelopes: Array<any>

  constructor(
  ) {
  }

  async getEnvelope() {
    if (this.envelopes) {
      return this.envelopes
    } else {
      return [{ "type": "0x01", "description": "Private Message Stored with MLI" }]
    }
  }

  // Only for stub
  /**
   * Sets the envelopes for the stub
   * @param envelopes Array of envelopes
   */
  public setEnvelopes(envelopes) {
    this.envelopes = envelopes
  }
}
