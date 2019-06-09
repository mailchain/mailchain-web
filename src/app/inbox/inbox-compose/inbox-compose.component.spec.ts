import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxComposeComponent } from './inbox-compose.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/services/helpers/http-helpers/http-helpers.service';

describe('InboxComposeComponent', () => {
  let component: InboxComposeComponent;
  let fixture: ComponentFixture<InboxComposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InboxComposeComponent,
      ],
      providers: [
        HttpHelpersService,
      ],
      imports: [
        FormsModule,
        HttpClientModule,
      ] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });
});
