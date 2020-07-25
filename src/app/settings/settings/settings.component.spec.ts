import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpHelpersService } from 'src/app/services/helpers/http-helpers/http-helpers.service';
import { MailchainService } from 'src/app/services/mailchain/mailchain.service';
import { of } from 'rxjs';
import { ProtocolsService } from 'src/app/services/mailchain/protocols/protocols.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LocalStorageServerService } from 'src/app/services/helpers/local-storage-server/local-storage-server.service';
import { ProtocolsServiceStub } from 'src/app/services/mailchain/protocols/protocols.service.stub';
import { LocalStorageServerServiceStub } from 'src/app/services/helpers/local-storage-server/local-storage-server.service.stub';
import { LocalStorageAccountService } from 'src/app/services/helpers/local-storage-account/local-storage-account.service';
import { LocalStorageAccountServiceStub } from 'src/app/services/helpers/local-storage-account/local-storage-account.service.stub';

fdescribe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mailchainService: MailchainService;
  let protocolsService: ProtocolsService;
  let mailchainTestService: MailchainTestService;
  let localStorageServerService: LocalStorageServerService;
  let localStorageAccountService: LocalStorageAccountService;

  let activatedRoute: any
  let networkList: any

  let currentNetwork = 'testnet';
  let currentWebProtocol = 'https';
  let currentHost = 'example.com';
  let currentPort = '8080';

  let localStorageCurrentWebProtocol: string;
  let localStorageCurrentPort: string;
  let localStorageCurrentHost: string;
  let localStorageCurrentNetwork: string;
  let localStorageCurrentProtocol: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        HttpHelpersService,
        MailchainService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        { provide: LocalStorageServerService, useClass: LocalStorageServerServiceStub },
        { provide: LocalStorageAccountService, useClass: LocalStorageAccountServiceStub },
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
      ]
    })
      .compileComponents();

    mailchainTestService = TestBed.get(MailchainTestService);
    protocolsService = TestBed.get(ProtocolsService);
    mailchainService = TestBed.get(MailchainService);
    localStorageServerService = TestBed.get(LocalStorageServerService);
    localStorageAccountService = TestBed.get(LocalStorageAccountService);


  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setCurrentProtocol', async () => {
      spyOn(component, "setCurrentProtocol")
      await component.ngOnInit()
      expect(component.setCurrentProtocol).toHaveBeenCalled()
    })
    it('should call setNetworkList', async () => {
      spyOn(component, "setNetworkList")
      await component.ngOnInit()
      expect(component.setNetworkList).toHaveBeenCalled()
    })
    it('should call setCurrentNetwork', async () => {
      spyOn(component, "setCurrentNetwork")
      await component.ngOnInit()
      expect(component.setCurrentNetwork).toHaveBeenCalled()
    })
    it('should call getServerSettings', async () => {
      spyOn(component, "getServerSettings")
      await component.ngOnInit()
      expect(component.getServerSettings).toHaveBeenCalled()
    })
    it('should call setCurrentSettings', async () => {
      spyOn(component, "setCurrentSettings")
      await component.ngOnInit()
      expect(component.setCurrentSettings).toHaveBeenCalled()
    })
  });

  describe('setCurrentProtocol', () => {
    it('should set the component currentProtocol to value stored in sessionStorage', () => {
      spyOn(window.sessionStorage, 'currentProtocol').and.returnValue('myProtocol')
      component.setCurrentProtocol()
      expect(component.currentProtocol).toBe('myProtcol')
    });
    it('should set the component currentProtocol to "ethereum" if no value is stored in sessionStorage', () => {
      spyOn(window.sessionStorage, 'currentProtocol').and.returnValue(undefined)
      component.setCurrentProtocol()
      expect(component.currentProtocol).toBe('ethereum')
    });
  })

  describe('setCurrentNetwork', () => {
    it('should set the component currentNetwork to value stored in sessionStorage if that value is also in the networks list for the currentProtcol', () => {
      spyOn(window.sessionStorage, 'currentProtocol').and.returnValue('myProtocol')
      component.networks = [
        { label: 'substrate', value: 'substrate' },
        { label: 'myProtocol', value: 'myProtocol' }
      ]
      component.setCurrentNetwork()

      expect(component.currentProtocol).toBe('myProtcol')
    });

    it('should set the component currentNetwork to the first value in the networks list for the currentProtocol if no value is stored in sessionStorage', () => {
      spyOn(window.sessionStorage, 'currentProtocol').and.returnValue(undefined)
      component.networks = [
        { label: 'myProtocol', value: 'myProtocol' },
        { label: 'substrate', value: 'substrate' }
      ]
      component.setCurrentNetwork()

      expect(component.currentProtocol).toBe('myProtocol')
    });

    it('should set the component currentNetwork to the first value in the networks list for the currentProtocol if the value stored in sessionStorage is not present in the networks list for the currentProtocol', () => {
      spyOn(window.sessionStorage, 'currentProtocol').and.returnValue('myProtocol')
      component.networks = [
        { label: 'substrate', value: 'substrate' },
        { label: 'myProtocol', value: 'myProtocol' }
      ]
      component.setCurrentNetwork()

      expect(component.currentProtocol).toBe('substrate')
    });

  })


  describe('changeProtocol', () => {
    it('should call setNetworkList function', () => {
      spyOn(component, "setNetworkList")
      component.changeProtocol()
      expect(component.setNetworkList).toHaveBeenCalled()
    });
    it('should set currentNetwork to the currentNetwork value in that value is present in the networks list for the currentProtocol', () => {
      // TODO
    });
    it('should set currentNetwork to the first value in the networks list if the currentNetwork is not in the network list for the currentProtocol', () => {
      // TODO
    });
  })

  // getServerSettings
  describe('changeProtocol', () => {
    it('should do something', () => {
      // TODO
    });
  })

  // setCurrentSettings
  describe('changeProtocol', () => {
    it('should do something', () => {
      // TODO
    });
  })

  describe('protocols and networks', () => {
    it('should get the available protocols', async () => {
      component.setNetworkList()
      expect(component.protocols).toEqual(['ethereum', 'substrate'])
    });

    it('should set the default protocol', () => {
      component.ngOnInit()
      expect(component.currentProtocol).toEqual('ethereum')
    });

    // it('should set the default network', () => {
    //   component.ngOnInit()
    //   expect(component.currentNetwork).toEqual('mainnet')
    // });

    // it('should get the networks based on the protocol', () => {
    //   component.ngOnInit()
    //   expect(component.networks).toEqual(["goerli", "kovan", "mainnet", "rinkeby", "ropsten"])
    // });

    // it('should update the networks based on the protocol changing', () => {
    //   component.ngOnInit()
    //   component.updateNetworks("substrate")
    //   expect(component.networks).toEqual(["edgeware-testnet"])
    // });

    // it('should reset the network and protocol to defaults', () => {
    // });

  });

  describe('setNetworkList', () => {
    beforeEach(() => {
      networkList = mailchainTestService.networkList();
    });

    it('should populate the network list', () => {
      expect(component.networks).toEqual([]);
      component.setNetworkList()
      expect(component.networks).toEqual(networkList)
    });
    it('should TODO MORE', () => {
      // TODO
    });
  });

  describe('getServerSettings', () => {
    it('should set the currentWebProtocol to the value foundin localStorage"', () => {
      let val = 'webProtocolVal'

      localStorageServerService.setCurrentWebProtocol(val)
      expect(component.currentWebProtocol).not.toEqual(val)

      component.getServerSettings()
      expect(component.currentWebProtocol).toEqual(val)

    });
    it('should set the currentHost to the value foundin localStorage"', () => {
      let val = 'hostVal'

      localStorageServerService.setCurrentWebProtocol(val)
      expect(component.currentWebProtocol).not.toEqual(val)

      component.getServerSettings()
      expect(component.currentWebProtocol).toEqual(val)
    });
    it('should set the currentPort to the value foundin localStorage"', () => {
      let val = 'portVal'

      localStorageServerService.setCurrentWebProtocol(val)
      expect(component.currentWebProtocol).not.toEqual(val)

      component.getServerSettings()
      expect(component.currentWebProtocol).toEqual(val)
    });
  });

  describe('removeCurrentAccount', () => {
    it('should call the localStorageAccountService.removeCurrentAccount function', () => {
      spyOn(localStorageAccountService, 'removeCurrentAccount');

      component.removeCurrentAccount();
      expect(localStorageAccountService.removeCurrentAccount).toHaveBeenCalled();
    });
  });

  describe('removeCurrentNetwork', () => {
    it('should call the localStorageServerService.removeCurrentNetwork function', () => {
      spyOn(localStorageServerService, 'removeCurrentNetwork');

      component.removeCurrentNetwork();
      expect(localStorageServerService.removeCurrentNetwork).toHaveBeenCalled();
    });
  });

  describe('updateServerSettings', () => {
    beforeEach(() => {
      spyOn(component, 'windowReload').and.callFake(function () { });
    });

    it('should set the webProtocol value from the settingsHash', async () => {
      let settingsHash = {
        "web-protocol": "customproto"
      }
      component.updateServerSettings()

      expect(localStorageServerService.getCurrentWebProtocol()).toEqual('customproto')

      expect(component.windowReload).toHaveBeenCalled();
    });
    it('should set the host value from the settingsHash', async () => {
      let settingsHash = {
        "host": "example.com"
      }
      component.updateServerSettings()
      fixture.detectChanges();

      expect(await localStorageServerService.getCurrentHost()).toEqual('example.com')

      expect(component.windowReload).toHaveBeenCalled();
    });
    it('should set the port value from the settingsHash', async () => {
      let settingsHash = {
        "port": "8888"
      }
      component.updateServerSettings()
      fixture.detectChanges();

      expect(await localStorageServerService.getCurrentPort()).toEqual('8888')

      expect(component.windowReload).toHaveBeenCalled();
    });

    it('should reload the current path if serverSettings are changed"', () => {
      let settingsHash = {
        "web-protocol": "customproto"
      }
      component.updateServerSettings()
      fixture.detectChanges();

      expect(component.windowReload).toHaveBeenCalled();
    });
    it('should NOT reload the current path if serverSettings are NOT changed"', () => {
      let settingsHash = {}
      component.updateServerSettings()
      fixture.detectChanges();

      expect(component.windowReload).not.toHaveBeenCalled();
    });
    it('should remove the currentAccount if serverSettings are changed"', async () => {
      let settingsHash = {
        "web-protocol": "customproto"
      }
      localStorageAccountService.setCurrentAccount("accountVal")
      expect(await localStorageAccountService.getCurrentAccount()).toEqual("accountVal")

      component.updateServerSettings()
      fixture.detectChanges();

      expect(await localStorageAccountService.getCurrentAccount()).toBeUndefined()
    });
    it('should NOT remove the currentAccount if serverSettings are NOT changed"', async () => {
      let settingsHash = {}
      localStorageAccountService.setCurrentAccount("accountVal")
      expect(await localStorageAccountService.getCurrentAccount()).toEqual("accountVal")

      component.updateServerSettings()
      fixture.detectChanges();

      expect(await localStorageAccountService.getCurrentAccount()).toEqual("accountVal");
    });

    it('should remove the currentNetwork if serverSettings are changed"', async () => {
      let settingsHash = {
        "web-protocol": "customproto"
      }
      localStorageServerService.setCurrentNetwork("networkVal")
      expect(await localStorageServerService.getCurrentNetwork()).toEqual("networkVal")

      component.updateServerSettings()
      fixture.detectChanges();

      expect(await localStorageServerService.getCurrentNetwork()).toBeUndefined()
    });
    it('should NOT remove the currentNetwork if serverSettings are NOT changed"', async () => {
      let settingsHash = {}
      localStorageServerService.setCurrentNetwork("networkVal")
      expect(await localStorageServerService.getCurrentNetwork()).toEqual("networkVal")

      component.updateServerSettings()
      fixture.detectChanges();

      expect(await localStorageServerService.getCurrentNetwork()).toEqual("networkVal");
    });

    it('should remove removeCurrentAccount if serverSettings have changed', () => {
      expect(component.windowReload).toHaveBeenCalled()
    });
    it('should NOT remove removeCurrentAccount if serverSettings have NOT changed', () => {
      expect(component.windowReload).not.toHaveBeenCalled()
    });
    it('should reload the window if serverSettings have changed', () => {
      expect(component.windowReload).toHaveBeenCalled()
    });
    it('should NOT reload the window if serverSettings NOT have changed', () => {
      expect(component.windowReload).not.toHaveBeenCalled()
    });
    // TODO: check removeCurrentAccount ran


  });

  describe('windowReload', () => {
    xit('should reload the component with the same path', () => {
      // TODO
    });

    xit('should remove any params in the url', () => {
      // TODO
    });
  });

});
