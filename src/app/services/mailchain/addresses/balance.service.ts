import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageServerService } from '../../helpers/local-storage-server/local-storage-server.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

@Injectable({
    providedIn: 'root'
})
export class BalanceService {

    private url: string

    constructor(
        private http: HttpClient,
        private httpHelpersService: HttpHelpersService,
        private localStorageServerService: LocalStorageServerService,
    ) {
        this.initUrl()
    }

    /**
     * Initialize URL from local storage
     */
    async initUrl() {
        this.url = `${this.localStorageServerService.getCurrentServerDetails()}/api`
    }

    /**
     * Get and return the balance for the address
     */
    async getBalance(address, protocol, network) {
        var httpOptions = this.httpHelpersService.getHttpOptions([
            ['protocol', protocol],
            ['network', network]
        ])

        let res = await this.http.get(
            this.url + `/addresses/` + address + `/balance`,
            httpOptions
            // TODO handle failure
        ).toPromise();

        return res["body"]["balance"]
    }

    /**
     * handleAddressFormatting
     * @param address 
     * @param encoding "hex/0x-prefix" | "base58/plain"
     */
    handleAddressFormatting(address, encoding) {
        switch (encoding) {
            case 'hex/0x-prefix':
                return address.toLowerCase()
            case 'base58/plain':
                return address
            default:
                return address
        }
    }


    /**
     * Returns the balance response with status codes
     */
    public getBalanceResponse(address, protocol, network) {
        var httpOptions = this.httpHelpersService.getHttpOptions([
            ['protocol', protocol],
            ['network', network]
        ])

        return this.http.get(
            this.url + `/addresses/` + address + `/balance`,
            httpOptions
        )
    }

}
