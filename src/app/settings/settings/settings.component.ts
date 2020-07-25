import { Component, OnInit } from '@angular/core';
import { ProtocolsService } from 'src/app/services/mailchain/protocols/protocols.service';
import { LocalStorageProtocolService } from 'src/app/services/helpers/local-storage-protocol/local-storage-protocol.service';
import { LocalStorageServerService } from 'src/app/services/helpers/local-storage-server/local-storage-server.service';
import { stringify } from 'querystring';
import { LocalStorageAccountService } from 'src/app/services/helpers/local-storage-account/local-storage-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public protocols: Array<any> = [];
  public networks: Array<any> = [];
  public currentNetwork: String = "mainnet";
  public currentProtocol: String = "ethereum";
  public currentSettings: any = {};

  public currentWebProtocol: string;
  public currentHost: string;
  public currentPort: string;

  constructor(
    private protocolsService: ProtocolsService,
    private localStorageProtocolService: LocalStorageProtocolService,
    private localStorageServerService: LocalStorageServerService,
    private localStorageAccountService: LocalStorageAccountService,
    private router: Router,

  ) {
  }

  async ngOnInit() {
    try {
      this.currentNetwork = await this.localStorageServerService.getCurrentNetwork()
      await this.setCurrentProtocol()
      await this.setNetworkList()
      await this.setCurrentNetwork()
      this.getServerSettings()
      this.setCurrentSettings()
    } catch (error) {
      this.getServerSettings()
      console.warn("error: " + error);
      console.warn("error: it doesn't look like your application is running. Please check your settings.");
    }
  }

  /**
   * setCurrentProtocol sets the currentProtocol to the value in localStorage 
   *   -or-
   *   sets the default protocol if none is configured ("ethereum")
   */
  private async setCurrentProtocol() {
    this.currentProtocol = await this.localStorageProtocolService.getCurrentProtocol() || "ethereum"
  }

  /**
   * setCurrentNetwork sets the currentNetwork to the value in localStorage
   *   -or-
   *   sets the default network if none is configured (the first Ethereum network)
   */
  private async setCurrentNetwork() {
    let localCurrentNetwork = await this.localStorageServerService.getCurrentNetwork()
    if (this.networksListContainsNetwork(localCurrentNetwork) || !this.networks.length) {
      console.log(1);

      this.currentNetwork = localCurrentNetwork
    } else {
      // protocol mismatch
      console.log(2, this.networks);
      this.currentNetwork = this.networks[0]["value"]
    }
  }

  /**
   * networksListContainsNetwork checks if this.networks values includes this.currentNetwork
   * @param network 
   */
  private networksListContainsNetwork(network): boolean {
    let networkValues = this.networks.map(function (el) { return el.value })
    return networkValues.includes(network)
  }

  /**
   * changeProtocol updates the network values in the list and sets the network to either be the original currentNetwork in session storage or the first in the list
   */
  public async changeProtocol() {
    await this.setNetworkList()

    if (
      this.currentProtocol == this.currentSettings["currentProtocol"] &&
      this.networks.map(el => el["value"]).includes(this.currentSettings["currentNetwork"])
    ) {
      this.currentNetwork = this.currentSettings["currentNetwork"]
    } else {
      this.currentNetwork = this.networks[0]["value"]
    }
  }

  /**
  * Retrieve the current server settings for the inbox
  */
  public getServerSettings() {
    this.currentWebProtocol = this.localStorageServerService.getCurrentWebProtocol()
    this.currentHost = this.localStorageServerService.getCurrentHost()
    this.currentPort = this.localStorageServerService.getCurrentPort()
  }

  /**
   * setCurrentSettings keeps the original settings to hand
   */
  setCurrentSettings() {
    this.currentSettings["currentWebProtocol"] = this.currentWebProtocol
    this.currentSettings["currentHost"] = this.currentHost
    this.currentSettings["currentPort"] = this.currentPort

    this.currentSettings["currentProtocol"] = this.currentProtocol
    this.currentSettings["currentNetwork"] = this.currentNetwork
  }

  /**
   * Set the list of networks in the dropdown
   */
  public async setNetworkList() {
    this.networks = []
    await this.protocolsService.getProtocols().toPromise().then(res => {
      this.protocols = res["protocols"].map(el => { return el["name"] });
      if (res["protocols"].length > 0) {
        res["protocols"].forEach(ptcl => {
          if (ptcl["name"] == this.currentProtocol) {
            this.networks = this.formatByNameForSelect(ptcl["networks"])
          }
        });
      }
    });
  }

  /**
   * formatByNameForSelect helper function to return a list for use in `<select>` element
   * returns: [{ label: "name", value: "name"},...]
   * @param array 
   */
  private formatByNameForSelect(array) {

    return array.map(el => {
      return {
        label: el["name"],
        value: el["name"],
      }
    });
  }


  /**
   * Removes the session storage currentAccount setting
   */
  removeCurrentAccount() {
    this.localStorageAccountService.removeCurrentAccount()
  }

  /**
   * Removes the session storage currentNetwork setting
   */
  removeCurrentNetwork() {
    this.localStorageServerService.removeCurrentNetwork()
  }

  returnToInboxMessages() {
    this.router.navigate(['/']);
  }

  /**
   * Updates the server settings and reloads the current path. The reload is intended to remove url params and reload a clean component.
   * @param settingsHash the server settings hash
   * `{ "web-protocol": "http"|"https", "host": "127.0.0.1", "port": "8080" }`
   */
  updateServerSettings() {
    let serverSettingsChanged: boolean = false
    let values = [
      {
        original: this.currentSettings["currentWebProtocol"],
        new: this.currentWebProtocol,
        updateSettingFn: this.localStorageServerService.setCurrentWebProtocol
      }, {
        original: this.currentSettings["currentHost"],
        new: this.currentHost,
        updateSettingFn: this.localStorageServerService.setCurrentHost
      }, {
        original: this.currentSettings["currentPort"],
        new: this.currentPort,
        updateSettingFn: this.localStorageServerService.setCurrentPort
      }, {
        original: this.currentSettings["currentProtocol"],
        new: this.currentProtocol,
        updateSettingFn: this.localStorageProtocolService.setCurrentProtocol
      }, {
        original: this.currentSettings["currentNetwork"],
        new: this.currentNetwork,
        updateSettingFn: this.localStorageServerService.setCurrentNetwork
      }
    ]

    values.forEach(val => {
      serverSettingsChanged = this.updateIfChanged(val, serverSettingsChanged);
    })

    if (serverSettingsChanged) {
      this.removeCurrentAccount();
      this.windowReload()
    }

  }
  /**
   * 
   * @param val The hash of values and the accompanying function to execute if conditions are met { original: "originalVal", new: "newVal", updateSettingFn: "updateFunction"}
   * @param serverSettingsChanged boolean to track if an update was requested 
   */
  private updateIfChanged(val: { original: any; new: String; updateSettingFn: (setting: any) => void; }, serverSettingsChanged: boolean) {
    if (val.new && val.new != val.original) {
      val.updateSettingFn(val.new);
      serverSettingsChanged = true;
    }
    return serverSettingsChanged;
  }

  /**
 * Reload the window with the original path.
 * Used to remove url params and reload a clean component
 */
  public windowReload() {
    let path = window.location.pathname
    window.location.replace(path)
  }





}
