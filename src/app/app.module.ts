import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from './services/helpers/http-helpers/http-helpers.service';
import { SearchPipe } from './pipes/search-pipe/search-pipe.pipe';
import { AddressPipe } from './pipes/address-pipe/address-pipe.pipe';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { ModalConnectivityErrorComponent } from './modals/modal-connectivity-error/modal-connectivity-error.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    AddressPipe,
    ModalConnectivityErrorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    HttpHelpersService,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  entryComponents: [
    ModalConnectivityErrorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


