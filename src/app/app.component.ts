import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConnectivityService } from './services/mailchain/connectivity/connectivity.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalConnectivityErrorComponent } from './modals/modal-connectivity-error/modal-connectivity-error.component';
import { errorMessages } from './services/helpers/error-messages/error-messages'
import { LocalStorageProtocolService } from './services/helpers/local-storage-protocol/local-storage-protocol.service';
import { LocalStorageServerService } from './services/helpers/local-storage-server/local-storage-server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public version: string = environment.version;
  public title = 'Mailchain Inbox';
  public apiVersionInfo = {};
  public errorTitle: string = ""
  public errorMessage: string = ""
  public apiVersion = "";
  public modalConnectivityError: BsModalRef;

  public currentNetwork: String;
  public currentProtocol: String;

  constructor(
    private connectivityService: ConnectivityService,
    private modalService: BsModalService,
    private localStorageProtocolService: LocalStorageProtocolService,
    private localStorageServerService: LocalStorageServerService,
  ) {

  }

  public setApiVersion() {
    this.apiVersion = this.apiVersionInfo["client-version"]
  }

  public async ngOnInit() {
    this.currentNetwork = await this.localStorageServerService.getCurrentNetwork()
    this.currentProtocol = await this.localStorageProtocolService.getCurrentProtocol()

    await this.handleApiProtocolsAvailability()
    await this.handleApiAddressesAvailability()
    await this.handleWebConnectivity()
    this.setApiVersion()
  }

  /**
   * handleApiAddressesAvailability checks if the client is available.
   * Displays an error modal if not able to connect or hides the error modal if able to connect
   */
  public async handleApiProtocolsAvailability() {
    let apiConnectivityInfo = await this.connectivityService.getApiProtocolsAvailability();

    if (apiConnectivityInfo["status"] == "error") {
      this.handleApiConnectivityError(apiConnectivityInfo)
    } else if (apiConnectivityInfo["status"] == "ok") {
      if (apiConnectivityInfo["protocols"] == 0) {
        // No protocols are configured
        this.handleErrorOnPage(
          errorMessages.protocolConfigurationErrorTitle,
          errorMessages.protocolConfigurationErrorMessage
        )
      } else {
        if (this.modalConnectivityError) {
          this.modalConnectivityError.hide()
        }
      }
    }
  }

  /**
   * handleApiAddressesAvailability checks if the client is available.
   * Displays an error modal if not able to connect or hides the error modal if able to connect
   */
  public async handleApiAddressesAvailability() {
    let apiConnectivityInfo = await this.connectivityService.getApiAddressAvailability();

    if (apiConnectivityInfo["status"] == "error") {
      this.handleApiConnectivityError(apiConnectivityInfo)
    } else if (apiConnectivityInfo["status"] == "ok") {
      if (apiConnectivityInfo["addresses"] == 0) {
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
   * handleApiConnectivityError
   */
  handleApiConnectivityError(errorBlock) {
    switch (errorBlock["code"]) {
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
        console.warn('please add a new error message for this code', errorBlock["code"]);
        break;
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
    if (this.apiVersionInfo["errors"] > 0) {

      let errorStatusFields = [
        "client",
        "release"
      ]

      errorStatusFields.forEach(element => {
        if (this.apiVersionInfo[`${element}-error-status`] != undefined) {
          this.handleErrorOnPage(
            errorMessages.connectionErrorTitle,
            this.apiVersionInfo[`${element}-error-message`]
          )
        }
      });
    }
    if (this.apiVersionInfo["status"] == "outdated") {
      this.handleErrorOnPage(
        errorMessages.updateAvailableTitle,
        `<p>Your Mailchain client version is ${this.apiVersionInfo["client-version"]}. Please upgrade it to version ${this.apiVersionInfo["release-version"]} to ensure things work as expected.</p><p>Please visit <a href="https://docs.mailchain.xyz/troubleshooting/common-inbox-errors" target="_blank">Docs: common inbox errors</a> to see how to fix this.</p>`
      )
    }
  }

  /**
   * handleErrorOnPage
   */
  public handleErrorOnPage(errorTitle, errorMessage) {

    if (this.errorTitle.length == 0 && this.errorMessage.length == 0) {
      this.errorTitle = errorTitle
      this.errorMessage = errorMessage

      const initialState = {
        errorTitle: errorTitle,
        errorMessage: errorMessage,
      };

      this.modalConnectivityError = this.modalService.show(ModalConnectivityErrorComponent, { initialState });
      this.modalConnectivityError.content.closeBtnName = 'Close'
    }
  }

}
