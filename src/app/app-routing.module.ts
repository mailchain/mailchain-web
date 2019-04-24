import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpHelpersService } from './services/helpers/http-helpers/http-helpers.service';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
  }
];

@NgModule({
  declarations: [
    InboxComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [HttpHelpersService],
  exports: [RouterModule]
})
export class AppRoutingModule {}
