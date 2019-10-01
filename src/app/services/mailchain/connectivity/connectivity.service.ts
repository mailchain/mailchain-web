import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, applicationApiConfig } from 'src/environments/environment';
import { VersionService } from '../version/version.service';
import { AddressesService } from '../addresses/addresses.service';
import { clean as semverClean, lt as semverLt } from 'semver'

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {
  // private semver = require('semver')

  constructor(
    private http: HttpClient,
    private versionService: VersionService,
    private addressesService: AddressesService,

  ) { }

  /**
   * Checks the API version.
   * Returns hash with:
   * {
   *    "status": "ok", "outdated" or "unknown",
   *    "release-version": "0.0.34",
   *    "client-version": "0.0.32"
   * }
   */
  public async getVersionStatus() {
    let result: any = {
      "status": "unknown",
      "release-version": "unknown",
      "client-version": "unknown"
    }

    let resReleaseReq = this.http.get(environment.repositoryVersionLatestEndpoint).toPromise()    
    let clientReleaseReq = this.versionService.getVersion().toPromise()
    
    let resRelease = await resReleaseReq
    let clientRelease = await clientReleaseReq
    
    if (resRelease["tag_name"]) {
      result["release-version"] = semverClean(resRelease["tag_name"])
    }
    if (clientRelease["version"]) {
      result["client-version"] = semverClean(clientRelease["version"])
    }    

    result["status"] = this.checkVersionStatus(
      result["release-version"],
      result["client-version"]
    )

    return result
  }

  /**
   * Compare the versions, returning the `status`:
   * "ok", "outdated", or "unknown"
   * @param releaseVersion 
   * @param clientVersion
   */
  private checkVersionStatus(releaseVersion,clientVersion){
    let rel = semverClean(releaseVersion)
    let client = semverClean(clientVersion)
    let status = "unknown"
        
    if ( rel == client) {
      status = "ok"
    } else if ( semverLt(client, rel) ) {
      status = "outdated"
    }

    return status
  }

  /**
   * Get API status (address endpoint) and number of addresses configured.
   * This helps a user understand/ troubleshoot connection details.
   * Errors:
   *    200 - OK
   *    404 - Not found
   *    0   - Nothing returns (offline?)
   *
   * Addresses: 0 by default
   */
  public async getApiAvailability() {
    let status = { "addresses": 0 }
    let res = await this.addressesService.getAddressesResponse().toPromise().catch(err => {
      status["status"] = "error",
      status["code"] = err.status,
      status["message"] = err.message
    });

    if (res && res["status"] == 200 ) {
      status["status"] = "ok",
      status["code"] = res["status"],
      status["message"] = res["statusText"]
      // Are any addresses configured?
      status["addresses"] = (res["body"] && res["body"]["addresses"]) ? res["body"]["addresses"].length : 0
    }
    
    return status
  }

  

}
