import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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


const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
  }
];

@NgModule({
  declarations: [
    InboxComponent,
    InboxMessagesComponent,
    InboxMessageComponent,
    InboxComposeComponent,
  ],
  imports: [
    FormsModule,
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    CommonModule,
    CKEditorModule,
    RouterModule.forRoot(routes)
  ],
  providers: [HttpHelpersService],
  exports: [RouterModule]
})
export class AppRoutingModule {}
