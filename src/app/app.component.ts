import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VersionService } from './services/mailchain/version/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public version: string = environment.version;
  public title = 'Mailchain Inbox';
  public apiVersion = "";

  constructor(
    private versionService: VersionService
  ) {
    this.getApiVersion()
  }

  public getApiVersion() {
    this.versionService.getVersion().subscribe(res => {
      this.apiVersion = res["version"]
    })
  }

}
