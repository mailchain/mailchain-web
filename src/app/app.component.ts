import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConnectivityService } from './services/mailchain/connectivity/connectivity.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalConnectivityErrorComponent } from './modals/modal-connectivity-error/modal-connectivity-error.component';
import { errorMessages } from './services/helpers/error-messages/error-messages'

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
  public errorTitle: string = ""
  public errorMessage: string = ""
  public apiVersion = "";
  public modalConnectivityError: BsModalRef;

  constructor(
    private connectivityService: ConnectivityService,
    private modalService: BsModalService
  ) {
    
  }

  public setApiVersion() {
    this.apiVersion = this.apiVersionInfo["client-version"]
  }

  public async ngOnInit(){
    await this.handleApiAvailability()
    await this.handleWebConnectivity()
    this.setApiVersion()    
  }

  /**
   * handleApiAvailability checks if the client is available.
   * Displays an error modal if not able to connect or hides the error modal if able to connect
   */
  public async handleApiAvailability() {
    this.apiConnectivityInfo = await this.connectivityService.getApiAvailability();
    
    if (this.apiConnectivityInfo["status"] == "error") {
      switch (this.apiConnectivityInfo["code"]) {
        case 0:
          // Could not connect to Mailchain client
          this.handleErrorOnPage(
            errorMessages.clientNotRunningErrorTitle,
            errorMessages.clientNotRunningErrorMessage
          )
          break;
      
        default:
          // Something else happened
          this.handleErrorOnPage(
            errorMessages.unknownErrorTitle,
            errorMessages.unknownErrorMessage
          )
          console.warn('please add a new error message for this code',this.apiConnectivityInfo["code"]);
          break;
      }
    } else if (this.apiConnectivityInfo["status"] == "ok") {
      if (this.apiConnectivityInfo["addresses"] == 0) {
        // No addresses are configured
        this.handleErrorOnPage(
          errorMessages.accountConfigurationErrorTitle,
          errorMessages.accountConfigurationErrorMessage
        )
      } else {
        if (this.modalConnectivityError) {
          this.modalConnectivityError.hide()
        }
      }
    }
  }

  /**
   * handleWebConnectivity
   */
  public async handleWebConnectivity() {
    
    try {
      this.apiVersionInfo = await this.connectivityService.getVersionStatus();
    } catch (error) {      
      this.handleErrorOnPage(
        errorMessages.connectionErrorTitle,
        error["message"]
      )
    }    
    if ( this.apiVersionInfo["errors"] > 0 ) {

      let errorStatusFields = [
        "client",
        "release"
      ]

      errorStatusFields.forEach(element => {
        if (this.apiVersionInfo[`${element}-error-status`] != undefined ) {
          this.handleErrorOnPage(
            errorMessages.connectionErrorTitle, 
            this.apiVersionInfo[`${element}-error-message`]
          )
        }
      });
    }
    if ( this.apiVersionInfo["status"] == "outdated" ) {
      this.handleErrorOnPage(
        errorMessages.updateAvailableTitle, 
        `<p>Your Mailchain client version is ${this.apiVersionInfo["client-version"]}.</p><p>Please upgrade it to ${this.apiVersionInfo["release-version"]} to ensure things work as expected.</p>`
      )
    }
  }
    
  /**
   * handleErrorOnPage
   */
  public handleErrorOnPage(errorTitle, errorMessage) {

    if (this.errorTitle.length == 0 && this.errorMessage.length == 0 ) {
      this.errorTitle = errorTitle
      this.errorMessage = errorMessage
      
      const initialState = {
        errorTitle: errorTitle,
        errorMessage: errorMessage,
      };
      
      this.modalConnectivityError = this.modalService.show(ModalConnectivityErrorComponent, {initialState});
      this.modalConnectivityError.content.closeBtnName = 'Close'
    }
  }

}
