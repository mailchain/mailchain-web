import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConnectivityService } from './services/mailchain/connectivity/connectivity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public version: string = environment.version;
  public title = 'Mailchain Inbox';
  public apiConnectivityInfo = {};
  public apiVersionInfo = {};
  public apiVersion = "";

  constructor(
    private connectivityService: ConnectivityService,
  ) {
    
  }

  public setApiVersion() {    
    this.apiVersion = this.apiVersionInfo["client-version"]
  }

  public async ngOnInit(){
    this.apiConnectivityInfo = await this.connectivityService.getApiAvailability();
    this.apiVersionInfo = await this.connectivityService.getVersionStatus();
    
    this.setApiVersion()
  }

  /**
   * If 200
   *    Addresses = 0, then add an account
   * If 0
   *    Ensure mailchain is installed, running on port WHATEVERFROM CONFIG
   * If 404
   *    Could not connect to the endpoint
   */

}
