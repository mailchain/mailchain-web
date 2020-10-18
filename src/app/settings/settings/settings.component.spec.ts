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
import { LocalStorageProtocolService } from 'src/app/services/helpers/local-storage-protocol/local-storage-protocol.service';
import { LocalStorageProtocolServiceStub } from 'src/app/services/helpers/local-storage-protocol/local-storage-protocol.service.stub';
import { Router } from '@angular/router';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mailchainService: MailchainService;
  let protocolsService: ProtocolsService;
  let mailchainTestService: MailchainTestService;
  let localStorageServerService: LocalStorageServerService;
  let localStorageAccountService: LocalStorageAccountService;
  let localStorageProtocolService: LocalStorageProtocolService;

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
  let router: Router

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        HttpHelpersService,
        MailchainService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        { provide: LocalStorageServerService, useClass: LocalStorageServerServiceStub },
        { provide: LocalStorageProtocolService, useClass: LocalStorageProtocolServiceStub },
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
    localStorageProtocolService = TestBed.get(LocalStorageProtocolService);
    router = TestBed.get(Router);

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
    it('should set the component currentProtocol to value returned from localStorageProtocolService', async () => {
      spyOn(localStorageProtocolService, 'getCurrentProtocol').and.returnValue('myProto')
      await component.setCurrentProtocol()

      expect(component.currentProtocol).toBe('myProto')
    });
    it('should set the component currentProtocol to "ethereum" if no value is returned from localStorageProtocolService', async () => {
      spyOn(localStorageProtocolService, 'getCurrentProtocol').and.returnValue(undefined)
      await component.setCurrentProtocol()
      expect(component.currentProtocol).toBe('ethereum')
    });
  })

  describe('setCurrentNetwork', () => {
    it('should set the component currentNetwork to value returned by localStorageServerService.getCurrentNetwork if that value is also in the networks list for the currentProtcol', async () => {
      spyOn(localStorageServerService, 'getCurrentNetwork').and.returnValue('mainnet')
      component.networks = [
        { label: 'testnet', value: 'testnet' },
        { label: 'mainnet', value: 'mainnet' }
      ]
      await component.setCurrentNetwork()

      expect(component.currentNetwork).toBe('mainnet')
    });

    it('should set the component currentNetwork to the first value in the networks list for the currentProtocol if no value is returned by localStorageServerService.getCurrentNetwork', async () => {
      spyOn(localStorageServerService, 'getCurrentNetwork').and.returnValue(undefined)
      component.networks = [
        { label: 'testnet', value: 'testnet' },
        { label: 'mainnet', value: 'mainnet' }
      ]
      await component.setCurrentNetwork()

      expect(component.currentNetwork).toBe('testnet')
    });

    it('should set the component currentNetwork to the first value in the networks list for the currentProtocol if the value returned by localStorageServerService.getCurrentNetwork is not present in the networks list for the currentProtocol', async () => {
      spyOn(localStorageServerService, 'getCurrentNetwork').and.returnValue('anothernet')
      component.networks = [
        { label: 'testnet', value: 'testnet' },
        { label: 'mainnet', value: 'mainnet' }
      ]
      await component.setCurrentNetwork()

      expect(component.currentNetwork).toBe('testnet')
    });

    it('should handle empty networks list', async () => {
      spyOn(localStorageServerService, 'getCurrentNetwork').and.returnValue('anothernet')
      component.networks = []
      await component.setCurrentNetwork()

      // expect(component.currentNetwork).toBe(undefined) // this is not undefined while applicationApiConfig is in use by localstorage (see https://github.com/mailchain/mailchain-web/issues/217)
      expect(component.currentNetwork).toBe('mainnet')
    });
  });

  describe('changeProtocol', () => {
    it('should call setNetworkList function', async () => {
      await component.ngOnInit
      spyOn(component, "setNetworkList")
      await component.changeProtocol()
      expect(component.setNetworkList).toHaveBeenCalled()
    });
    it('should set the currentNetwork to the original currentNetwork value if that value is present in the networks list for the currentProtocol', async () => {
      component.currentProtocol = 'myProtocol'
      component.currentSettings['currentProtocol'] = 'myProtocol'
      component.currentSettings['currentNetwork'] = 'myNetwork'
      component.networks = [
        { label: 'testnet', value: 'testnet' },
        { label: 'myNetwork', value: 'myNetwork' },
        { label: 'othernet', value: 'othernet' }
      ]
      spyOn(component, "setNetworkList").and.returnValue(of(''))

      await component.changeProtocol()
      component.changeProtocol()
      expect(component.currentNetwork).toBe('myNetwork')
    });
    it('should set currentNetwork to the first value in the networks list if the currentNetwork is not in the network list for the currentProtocol', async () => {
      component.currentProtocol = 'myProtocol'
      component.currentSettings['currentProtocol'] = 'myProtocol'
      component.currentSettings['currentNetwork'] = 'myNetwork'
      component.networks = [
        { label: 'testnet', value: 'testnet' },
        { label: 'othernet', value: 'othernet' }
      ]
      spyOn(component, "setNetworkList").and.returnValue(of(''))

      await component.changeProtocol()
      expect(component.currentNetwork).toBe('testnet')
    });
  })

  describe('getServerSettings', () => {
    it('should call localStorageServerService.getCurrentWebProtocol function', () => {
      spyOn(localStorageServerService, "getCurrentWebProtocol")
      component.getServerSettings()
      expect(localStorageServerService.getCurrentWebProtocol).toHaveBeenCalled()
    });
    it('should call localStorageServerService.getCurrentHost function', () => {
      spyOn(localStorageServerService, "getCurrentHost")
      component.getServerSettings()
      expect(localStorageServerService.getCurrentHost).toHaveBeenCalled()
    });
    it('should call localStorageServerService.getCurrentPort function', () => {
      spyOn(localStorageServerService, "getCurrentPort")
      component.getServerSettings()
      expect(localStorageServerService.getCurrentPort).toHaveBeenCalled()
    });
  })

  describe('setCurrentSettings', () => {
    beforeEach(() => {
      component.currentWebProtocol = "myCurrentWebProtocol"
      component.currentHost = "myCurrentHost"
      component.currentPort = "myCurrentPort"
      component.currentProtocol = "myCurrentProtocol"
      component.currentNetwork = "myCurrentNetwork"
      component.setCurrentSettings()
    });

    it('should store currentWebProtocol field in currentSettings', () => {
      expect(component.currentSettings["currentWebProtocol"]).toBe('myCurrentWebProtocol')
    });
    it('should store currentHost field in currentSettings', () => {
      expect(component.currentSettings["currentHost"]).toBe('myCurrentHost')
    });
    it('should store currentPort field in currentSettings', () => {
      expect(component.currentSettings["currentPort"]).toBe('myCurrentPort')
    });
    it('should store currentProtocol field in currentSettings', () => {
      expect(component.currentSettings["currentProtocol"]).toBe('myCurrentProtocol')
    });
    it('should store currentNetwork field in currentSettings', () => {
      expect(component.currentSettings["currentNetwork"]).toBe('myCurrentNetwork')
    });
  })

  describe('setNetworkList', () => {
    it('should get the available protocols', async () => {
      await component.setNetworkList()
      expect(component.protocols).toEqual(['ethereum', 'substrate'])
    });

    it('should set network list for the currentProtocol', async () => {
      await component.ngOnInit()

      component.currentProtocol = 'ethereum'
      await component.setNetworkList()
      expect(component.networks).toEqual([
        { label: "goerli", value: "goerli" },
        { label: "kovan", value: "kovan" },
        { label: "mainnet", value: "mainnet" },
        { label: "rinkeby", value: "rinkeby" },
        { label: "ropsten", value: "ropsten" },
      ])

      component.currentProtocol = 'substrate'
      await component.setNetworkList()
      expect(component.networks).toEqual([
        { label: "edgeware-beresheet", value: "edgeware-beresheet" },
        { label: "edgeware-local", value: "edgeware-local" },
        { label: "edgeware-mainnet", value: "edgeware-mainnet" },
      ])

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

  describe('returnToInboxMessages', () => {
    it('should navigate to "/"', () => {
      spyOn(router, 'navigate');

      component.returnToInboxMessages();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('updateServerSettings', () => {
    beforeEach(() => {
      component.ngOnInit()

      component.currentSettings["currentWebProtocol"] = "myCurrentWebProtocol"
      component.currentWebProtocol = "myCurrentWebProtocol"
      spyOn(localStorageServerService, 'setCurrentWebProtocol')

      component.currentSettings["currentHost"] = "myCurrentHost"
      component.currentHost = "myCurrentHost"
      spyOn(localStorageServerService, 'setCurrentHost')

      component.currentSettings["currentPort"] = "myCurrentPort"
      component.currentPort = "myCurrentPort"
      spyOn(localStorageServerService, 'setCurrentPort')

      component.currentSettings["currentProtocol"] = "myCurrentProtocol"
      component.currentProtocol = "myCurrentProtocol"
      spyOn(localStorageProtocolService, 'setCurrentProtocol')

      component.currentSettings["currentNetwork"] = "myCurrentNetwork"
      component.currentNetwork = "myCurrentNetwork"
      spyOn(localStorageServerService, 'setCurrentNetwork')

      spyOn(component, 'windowReload').and.callFake(function () { }); // required here to stop reload looping in test
    });

    describe('removeCurrentAccount', () => {
      it('should remove removeCurrentAccount if a serverSetting has changed', () => {
        spyOn(component, 'removeCurrentAccount')
        component.currentWebProtocol = "myNewWebProtocol"
        component.updateServerSettings()
        expect(component.removeCurrentAccount).toHaveBeenCalled()
      });

      it('should NOT remove removeCurrentAccount if serverSettings have NOT changed', () => {
        spyOn(component, 'removeCurrentAccount')
        component.updateServerSettings()
        expect(component.removeCurrentAccount).not.toHaveBeenCalled()
      });
    });

    describe('windowReload', () => {
      it('should reload the window if serverSettings have changed', () => {
        component.currentWebProtocol = "newCurrentWebProtocol"
        component.updateServerSettings()
        expect(component.windowReload).toHaveBeenCalled()
      });

      it('should NOT reload the window if serverSettings NOT have changed', () => {
        component.updateServerSettings()
        expect(component.windowReload).not.toHaveBeenCalled()
      });
    });

    describe('currentWebProtocol', () => {
      it('should NOT call "localStorageServerService.setCurrentWebProtocol" if "currentWebProtocol" has not changed', () => {
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentWebProtocol).not.toHaveBeenCalled()
      });

      it('should NOT call "localStorageServerService.setCurrentWebProtocol" if a different setting ("currentHost") has changed', () => {
        component.currentHost = "newCurrentHost"
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentWebProtocol).not.toHaveBeenCalled()
      });

      it('should call "localStorageServerService.setCurrentWebProtocol" with the new value if "currentWebProtocol" has changed', () => {
        component.currentWebProtocol = "newCurrentWebProtocol"
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentWebProtocol).toHaveBeenCalledWith('newCurrentWebProtocol')
      });
    });


    describe('currentHost', () => {
      it('should NOT call "localStorageServerService.setCurrentHost" if "currentHost" has not changed', () => {
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentHost).not.toHaveBeenCalled()
      });

      it('should NOT call "localStorageServerService.setCurrentHost" if a different setting ("currentWebProtocol") has changed', () => {
        component.currentWebProtocol = "newCurrentWebProtocol"
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentHost).not.toHaveBeenCalled()
      });

      it('should call "localStorageServerService.setCurrentHost" with the new value if "currentHost" has changed', () => {
        component.currentHost = "newCurrentHost"
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentHost).toHaveBeenCalledWith('newCurrentHost')
      });
    });

    describe('currentPort', () => {
      it('should NOT call "localStorageServerService.setCurrentPort" if "currentPort" has not changed', () => {
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentPort).not.toHaveBeenCalled()
      });

      it('should NOT call "localStorageServerService.setCurrentPort" if a different setting ("currentHost") has changed', () => {
        component.currentHost = "newCurrentHost"
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentPort).not.toHaveBeenCalled()
      });

      it('should call "localStorageServerService.setCurrentPort" with the new value if "currentWebProtocol" has changed', () => {
        component.currentPort = "newCurrentPort"
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentPort).toHaveBeenCalledWith('newCurrentPort')
      });
    });

    describe('currentProtocol', () => {
      it('should NOT call "localStorageProtocolService.setCurrentProtocol" if "currentProtocol" has not changed', () => {
        component.updateServerSettings()
        expect(localStorageProtocolService.setCurrentProtocol).not.toHaveBeenCalled()
      });

      it('should NOT call "localStorageProtocolService.setCurrentProtocol" if a different setting ("currentHost") has changed', () => {
        component.currentHost = "newCurrentHost"
        component.updateServerSettings()
        expect(localStorageProtocolService.setCurrentProtocol).not.toHaveBeenCalled()
      });

      it('should call "localStorageProtocolService.setCurrentProtocol" with the new value if "currentWebProtocol" has changed', () => {
        component.currentProtocol = "newCurrentProtocol"
        component.updateServerSettings()
        expect(localStorageProtocolService.setCurrentProtocol).toHaveBeenCalledWith('newCurrentProtocol')
      });
    });

    describe('currentNetwork', () => {
      it('should NOT call "localStorageServerService.setCurrentNetwork" if "currentNetwork" has not changed', () => {
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentNetwork).not.toHaveBeenCalled()
      });

      it('should NOT call "localStorageServerService.setCurrentNetwork" if a different setting ("currentHost") has changed', () => {
        component.currentHost = "newCurrentHost"
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentNetwork).not.toHaveBeenCalled()
      });

      it('should call "localStorageServerService.setCurrentNetwork" with the new value if "currentNetwork" has changed', () => {
        component.currentNetwork = "newCurrentNetwork"
        component.updateServerSettings()
        expect(localStorageServerService.setCurrentNetwork).toHaveBeenCalledWith('newCurrentNetwork')
      });
    });

  });

});
