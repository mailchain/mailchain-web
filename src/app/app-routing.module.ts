import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpHelpersService } from './services/helpers/http-helpers/http-helpers.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { InboxComposeComponent } from './inbox/inbox-compose/inbox-compose.component';
import { InboxMessageComponent } from './inbox/inbox-message/inbox-message.component';
import { InboxMessagesComponent } from './inbox/inbox-messages/inbox-messages.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SettingsComponent } from './settings/settings/settings.component';


const routes: Routes = [
  { path: '', component: InboxComponent },
  { path: 'settings', component: SettingsComponent }

];

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
};

@NgModule({
  declarations: [
    InboxComponent,
    InboxMessagesComponent,
    InboxMessageComponent,
    InboxComposeComponent,
    SettingsComponent,
  ],
  imports: [
    FormsModule,
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    CommonModule,
    CKEditorModule,
    RouterModule.forRoot(routes, routerOptions)
  ],
  providers: [HttpHelpersService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
