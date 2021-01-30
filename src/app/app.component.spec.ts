import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { ConnectivityService } from './services/mailchain/connectivity/connectivity.service';
import { MailchainTestService } from './test/test-helpers/mailchain-test.service';
import { ModalConnectivityErrorComponent } from './modals/modal-connectivity-error/modal-connectivity-error.component';
import { NgModule } from '@angular/core';
import { errorMessages } from './services/helpers/error-messages/error-messages'
import { HttpHelpersService } from './services/helpers/http-helpers/http-helpers.service';


// Workaround:
// Error from entryComponents not present in TestBed. Fix ref: https://stackoverflow.com/a/42399718
@NgModule({
  declarations: [ModalConnectivityErrorComponent],
  entryComponents: [ModalConnectivityErrorComponent]
})
export class FakeModalConnectivityErrorModule { }
// End workaround

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let connectivityService: ConnectivityService;
  let mailchainTestService: MailchainTestService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ModalModule.forRoot(),
        FakeModalConnectivityErrorModule,
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        HttpHelpersService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    connectivityService = TestBed.get(ConnectivityService)
    mailchainTestService = TestBed.get(MailchainTestService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    describe('setApiVersion', () => {
      it('set the API version as part of ngOnInit (after other calls have been made)', async () => {
        expect(component.apiVersion).toEqual("")
        let ver = "1.4.1"
        component.apiVersionInfo["client-version"] = ver
        component.setApiVersion()

        expect(component.apiVersion).toEqual(ver)
      });
    });

  });

  describe('handleApiAddressesAvailability', () => {
    it('should handle connection refused error', async () => {
      spyOn(connectivityService, 'getApiAddressAvailability').and.returnValue(mailchainTestService.getApiAddressAvailabilityConnectionRefused())

      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      await component.handleApiAddressesAvailability()

      expect(component.errorTitle).toEqual(errorMessages.clientNotRunningErrorTitle)
      expect(component.errorMessage).toEqual(errorMessages.clientNotRunningErrorMessage)

    });

    it('should handle unknown error', async () => {
      spyOn(connectivityService, 'getApiAddressAvailability').and.returnValue(mailchainTestService.getApiAddressAvailabilityErrorUnknown())

      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      await component.handleApiAddressesAvailability()

      expect(component.errorTitle).toEqual(errorMessages.unknownErrorTitle)
      expect(component.errorMessage).toEqual(errorMessages.unknownErrorMessage)

    });

    it('should handle status ok, with 0 addresses, error', async () => {
      spyOn(connectivityService, 'getApiAddressAvailability').and.returnValue(mailchainTestService.getApiAddressAvailabilitySuccessNoAddresses())

      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      await component.handleApiAddressesAvailability()

      expect(component.errorTitle).toEqual(errorMessages.accountConfigurationErrorTitle)
      expect(component.errorMessage).toEqual(errorMessages.accountConfigurationErrorMessage)

    });

    it('should handle status ok, with addresses', async () => {
      spyOn(connectivityService, 'getApiAddressAvailability').and.returnValue(mailchainTestService.getApiAddressAvailabilitySuccess())

      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      await component.handleApiAddressesAvailability()

      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

    });
  });

  describe('handleWebConnectivity', () => {
    xit('should handle an error fetching version info', () => {
      // TODO handle error
    });
    it('should show an error if the client-error-status field is defined', async () => {
      spyOn(connectivityService, 'getVersionStatus').and.returnValue(mailchainTestService.apiVersionInfoClientError())

      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      await component.handleWebConnectivity()

      expect(component.errorTitle).toEqual(errorMessages.connectionErrorTitle)
      expect(component.errorMessage).toEqual("7 Some Client Error")

    });
    it('should show an error if the release-error-status field is defined', async () => {
      spyOn(connectivityService, 'getVersionStatus').and.returnValue(mailchainTestService.apiVersionInfoReleaseError())

      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      await component.handleWebConnectivity()

      expect(component.errorTitle).toEqual(errorMessages.connectionErrorTitle)
      expect(component.errorMessage).toEqual("5 Some Release Error")
    });

    it('should show an error if the api version is outdated', async () => {
      spyOn(connectivityService, 'getVersionStatus').and.returnValue(mailchainTestService.apiVersionInfoOutdated())

      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      await component.handleWebConnectivity()

      expect(component.errorTitle).toEqual(errorMessages.updateAvailableTitle)
      expect(component.errorMessage).toEqual('<p>Your Mailchain client version is 1.4.1. Please upgrade it to version 1.4.2 to ensure things work as expected.</p><p>Please visit <a href="https://docs.mailchain.xyz/troubleshooting/common-inbox-errors" target="_blank">Docs: common inbox errors</a> to see how to fix this.</p>')
    });

  });

  describe('handleErrorOnPage', () => {
    it('should show error on page', () => {
      expect(component.errorTitle).toEqual("")
      expect(component.errorMessage).toEqual("")

      let title = "Error Title"
      let msg = "Error Message"

      component.handleErrorOnPage(title, msg)

      expect(component.errorTitle).toEqual(title)
      expect(component.errorMessage).toEqual(msg)

      expect(component.modalConnectivityError.content["errorTitle"]).toEqual(title)
      expect(component.modalConnectivityError.content["errorMessage"]).toEqual(msg)

    });

    it('should only show error on page if no other error is present', () => {
      let origTitle = "Existing error"
      let origMsg = "Error is already in view"
      let title = "Error Title"
      let msg = "Error Message"

      component.errorTitle = origTitle
      component.errorMessage = origMsg

      component.handleErrorOnPage(title, msg)

      expect(component.errorTitle).toEqual(origTitle)
      expect(component.errorMessage).toEqual(origMsg)

    });
  });

});
