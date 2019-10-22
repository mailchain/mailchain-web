import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { VersionService } from '../version/version.service';
import { AddressesService } from '../addresses/addresses.service';
import { lt as semverLt, coerce as semverCoerce } from 'semver'

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
      "errors": 0,
    }

    let resRelease: any = await this.getResRelease();
    let clientRelease: any = await this.getClientRelease();
    
    result = {
      ...result,
      ...resRelease,
      ...clientRelease
    }
    
    result["errors"] = (
      result["errors"] +
      result["release-error"] +
      result["client-error"]
    )
    
    result["status"] = this.checkVersionStatus(
      result["release-version"],
      result["client-version"]
    )
    
    return result
  }

  /**
   * Get the latest release version from release api endpoint.
   * If something doesn't return semantic version, return soft error
   */
  public async getResRelease(){
    let result = {
      "release-version": "unknown",
      "release-error-message": "",
      "release-error-status": undefined,
      "release-error": 0
    }
    let resReleaseReq = this.http.get(environment.repositoryVersionLatestEndpoint).toPromise()
    
    try {
      let resRelease = await resReleaseReq
      if (resRelease && resRelease != null && resRelease["tag_name"]) {
        result["release-version"] = semverCoerce(resRelease["tag_name"]).version
      }
    } catch (error) {
      result["release-error-status"] = error["status"]
      result["release-error-message"] = error["message"]
      result["release-error"] = 1

    }
    return result
  }

  /**
   * Get the client release version from local env.
   * If something doesn't return semantic version, return soft error
   */
  public async getClientRelease() {
    let result = {
      "client-version": "unknown",
      "client-error-message": "",
      "client-error-status": undefined,
      "client-error": 0
    }
    let clientReleaseReq = this.versionService.getVersion().toPromise()
    
    try {
      let clientRelease = await clientReleaseReq
      
      if (clientRelease && clientRelease != null && clientRelease["version"]) {
        result["client-version"] = semverCoerce(clientRelease["version"]).version
      }    

    } catch (error) {
      result["client-error-status"] = error["status"]
      result["client-error-message"] = error["message"]
      result["client-error"] = 1
    }
    return result
  }

  /**
   * Compare the versions, returning the `status`:
   * "ok", "outdated", or "unknown"
   * @param releaseVersion 
   * @param clientVersion
   */
  private checkVersionStatus(releaseVersion,clientVersion){   
    let status = "unknown"
    if ( ![clientVersion, releaseVersion].includes(null) ) {
      let rel = semverCoerce(releaseVersion["version"])
      let client = semverCoerce(clientVersion["version"])
      
      let versionsDefined = ( 
        ![rel,client].includes(undefined) && [rel,client].includes(null)
      )

      if ( versionsDefined && rel == client ) {
        status = "ok"
      } else if ( versionsDefined && semverLt(client, rel) ) {
        status = "outdated"
      }
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
