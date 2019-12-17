import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class HttpHelpersService {

  constructor() { }

  /**
   * Get the httpOptions for a request
   * @param queryParams (optional) as array of arrays containing [['key', 'value']]
   */
  public getHttpOptions(queryParams?) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: "response",
      params: new HttpParams()
    };
    // If we have params, set them and return the httpOptions:
    return this.setParams(httpOptions, queryParams)
  }

  /**
   * Return the HttpParams object
   * @param httpOptions httpOptions
   * @param queryParams as array of arrays containing [['key', 'value']]
   * e.g. [['status', 'open']] >> ?status=open
   */
  setParams(httpOptions, queryParams?) {
    httpOptions.params = new HttpParams()
    if (queryParams != undefined) {
      queryParams.forEach(param => {
        httpOptions.params = httpOptions.params.append(param[0], param[1]);
      });
    } else {
      httpOptions.params = new HttpParams() // need to make sure params are not cached as strange things can happen
    }
    return httpOptions;
  };

}
