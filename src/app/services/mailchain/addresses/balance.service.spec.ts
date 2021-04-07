import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BalanceService } from './balance.service';
import { MailchainTestService } from 'src/app/test/test-helpers/mailchain-test.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';
import { ProtocolsServiceStub } from '../protocols/protocols.service.stub';
import { ProtocolsService } from '../protocols/protocols.service';
import { Observable, of } from 'rxjs';


describe('BalanceService', () => {

    let balanceService: BalanceService;
    let httpTestingController: HttpTestingController;
    let mailchainTestService: MailchainTestService
    let serverResponse

    const currentAccount = '0x92d8f10248c6a3953cc3692a894655ad05d61efb';
    const desiredUrl = `http://127.0.0.1:8080/api/addresses/` + currentAccount + `/balance?protocol=ethereum&network=mainnet`

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HttpHelpersService,
                { provide: ProtocolsService, useClass: ProtocolsServiceStub },
                BalanceService,
            ],
            imports: [HttpClientTestingModule]
        });

        balanceService = TestBed.inject(BalanceService);
        mailchainTestService = TestBed.inject(MailchainTestService);
        httpTestingController = TestBed.inject(HttpTestingController);

        //serverResponse = mailchainTestService.senderAddressesEthereumObserveResponse()
        // expectedAddresses = mailchainTestService.senderAddresses()
    });

    afterEach(() => {
        httpTestingController.verify();
    });


    describe('initUrl', () => {
        it('should initialize the url', () => {
            balanceService.initUrl()
            expect(balanceService['url']).toEqual('http://127.0.0.1:8080/api')
        });
    })

    it('should be created', () => {
        expect(balanceService).toBeTruthy();
    });

    describe('getBalance', () => {
        beforeEach(() => {
            let obs: Observable<any> = of(mailchainTestService.senderAddressesEthereumObserveResponse())
            spyOn(balanceService, 'getBalance').and.returnValue(
                obs.toPromise()
            )
        });
        it('should get balance for addresses', async () => {
            let result
            await balanceService.getBalance(currentAccount, 'ethereum', 'mainnet').then(res => {
                result = res
            });
            expect(result).toEqual(mailchainTestService.senderAddressesEthereumObserveResponse())
            expect(balanceService.getBalance).toHaveBeenCalled()
        });
    })
});
