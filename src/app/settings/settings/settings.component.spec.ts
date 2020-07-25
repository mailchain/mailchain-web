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

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mailchainService: MailchainService;
  let protocolsService: ProtocolsService;
  let mailchainTestService: MailchainTestService;
  let localStorageServerService: LocalStorageServerService;

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

  class ProtocolsServiceStub {
    getProtocols() {
      return of(mailchainTestService.protocolsServerResponse())
    }
  }

  class LocalStorageServerServiceStub {
    getCurrentWebProtocol() {
      return localStorageCurrentWebProtocol
    }
    setCurrentWebProtocol(protocol) {
      localStorageCurrentWebProtocol = protocol
    }
    getCurrentHost() {
      return localStorageCurrentHost
    }
    setCurrentHost(host) {
      localStorageCurrentHost = host
    }
    getCurrentPort() {
      return localStorageCurrentPort
    }
    setCurrentPort(port) {
      localStorageCurrentPort = port
    }
    getCurrentNetwork() {
      return localStorageCurrentNetwork
    }
    getCurrentProtocol() {
      return localStorageCurrentProtocol
    }
    setCurrentNetwork(network) {
      localStorageCurrentNetwork = network
    }
    getCurrentServerDetails() {
      return `${currentWebProtocol}://${currentHost}:${currentPort}`
    }
    removeCurrentNetwork() {
      localStorageCurrentNetwork = undefined
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        HttpHelpersService,
        MailchainService,
        { provide: ProtocolsService, useClass: ProtocolsServiceStub },
        { provide: LocalStorageServerService, useClass: LocalStorageServerServiceStub },
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

  fdescribe('protocols and networks', () => {
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
  });

  // describe('setCurrentWebProtocolsList', () => {
  //   beforeEach(() => {
  //     currentWebProtocolsList = mailchainTestService.currentWebProtocolsList()
  //   });

  //   it('should populate the web protocols', () => {
  //     expect(component.currentWebProtocols).toEqual([]);
  //     component.setCurrentWebProtocolsList()
  //     expect(component.currentWebProtocols).toEqual(currentWebProtocolsList)
  //   });

  // });

  // describe('checkServerSettingsInQueryParams', () => {
  //   let wpVal = 'zttps'
  //   let hostVal = 'someexample.com'
  //   let portVal = '2019'

  //   beforeEach(() => {
  //     activatedRoute = fixture.debugElement.injector.get(ActivatedRoute) as any;


  //     spyOn(component, 'windowReload').and.callFake(function () { });
  //     // activatedRoute.testParamMap = {category: 'api-02'};
  //     // activatedRoute.testQueryParamMap = {period:'2018',size:'14'};
  //   })

  //   it('should update serverSettings if params are present', () => {
  //     activatedRoute.testQueryParamMap = {
  //       "web-protocol": wpVal,
  //       "host": hostVal,
  //       "port": portVal
  //     };

  //     component.checkServerSettingsInQueryParams()
  //     expect(localStorageServerService.getCurrentWebProtocol()).toEqual(wpVal)
  //     expect(localStorageServerService.getCurrentHost()).toEqual(hostVal)
  //     expect(localStorageServerService.getCurrentPort()).toEqual(portVal)
  //   });

  //   it('should NOT update webProtocol serverSettings if webProtocol param is NOT present', () => {
  //     let originalVal = localStorageServerService.getCurrentWebProtocol()

  //     activatedRoute.testQueryParamMap = {
  //       // "web-protocol":wpVal,
  //       "host": hostVal,
  //       "port": portVal
  //     };

  //     component.checkServerSettingsInQueryParams()
  //     expect(localStorageServerService.getCurrentWebProtocol()).not.toEqual(wpVal)
  //     expect(localStorageServerService.getCurrentWebProtocol()).toEqual(originalVal)
  //   });
  //   it('should NOT update host serverSettings if host param is NOT present', () => {
  //     let originalVal = localStorageServerService.getCurrentHost()

  //     activatedRoute.testQueryParamMap = {
  //       "web-protocol": wpVal,
  //       // "host":hostVal,
  //       "port": portVal
  //     };

  //     component.checkServerSettingsInQueryParams()
  //     expect(localStorageServerService.getCurrentHost()).not.toEqual(hostVal)
  //     expect(localStorageServerService.getCurrentHost()).toEqual(originalVal)
  //   });
  //   it('should NOT update port serverSettings if port param is NOT present', () => {
  //     let originalVal = localStorageServerService.getCurrentPort()

  //     activatedRoute.testQueryParamMap = {
  //       "web-protocol": wpVal,
  //       "host": hostVal,
  //       // "port":portVal
  //     };

  //     component.checkServerSettingsInQueryParams()
  //     expect(localStorageServerService.getCurrentPort()).not.toEqual(portVal)
  //     expect(localStorageServerService.getCurrentPort()).toEqual(originalVal)
  //   });

  // });

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

});
