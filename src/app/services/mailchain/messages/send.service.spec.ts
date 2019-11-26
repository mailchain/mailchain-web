import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SendService } from './send.service';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

import { MailchainTestService } from '../../../test/test-helpers/mailchain-test.service';

describe('SendService', () => {
  let sendService: SendService;
  let httpTestingController: HttpTestingController;
  let mailchainTestService: MailchainTestService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SendService,
        HttpHelpersService,
        MailchainTestService,
      ],
      imports: [ HttpClientTestingModule ]
    });

    sendService = TestBed.get(SendService);
    httpTestingController = TestBed.get(HttpTestingController);
    mailchainTestService = TestBed.get(MailchainTestService);
    
  });

  afterEach(() => {
    httpTestingController.verify();
  });
  
  it('should be created', () => {
    expect(sendService).toBeTruthy();
  });

  describe('initUrl', () => {
    it('should initialize the url', () => {    
      expect(sendService['url']).toEqual('http://127.0.0.1:8080/api')
    });
    
    it('should initialize the protocol', () => {    
      expect(sendService['protocol']).toEqual('ethereum')
    });
  });

  describe('SendMail', () => {
    it('should send an outbound mail to the right url', () => {

      let outboundMailObject = mailchainTestService.outboundMailObject()
      let resResponse = mailchainTestService.sendMailResponse()

      let response = sendService.sendMail(outboundMailObject,'ropsten')

      response.subscribe(res => { 
        expect(res["url"]).toEqual(resResponse["url"])
      })      
      // handle open connections      
      const req = httpTestingController.expectOne(resResponse["url"]);
      expect(req.request.method).toBe("POST");
      req.flush(resResponse);
      
    })
    it('should send an outbound mail and return the right body', () => {

      let outboundMailObject = mailchainTestService.outboundMailObject()
      let resResponse = mailchainTestService.sendMailResponse()

      let response = sendService.sendMail(outboundMailObject,'ropsten')

      response.subscribe(res => {
        expect(res["body"]["body"]).toEqual(resResponse["body"])
      })

      // handle open connections
      const req = httpTestingController.expectOne(resResponse["url"]);
      expect(req.request.method).toBe("POST");
      req.flush(resResponse);
      
    })
    it('should send an outbound mail and get a 200 response', () => {

      let outboundMailObject = mailchainTestService.outboundMailObject()
      let resResponse = mailchainTestService.sendMailResponse()

      let response = sendService.sendMail(outboundMailObject,'ropsten')

      response.subscribe(res => { 
        expect(res["status"]).toEqual(resResponse["status"])
      })

      // handle open connections
      const req = httpTestingController.expectOne(resResponse["url"]);
      expect(req.request.method).toBe("POST");
      req.flush(resResponse);
      
    })

    it('should send an outbound mail to the right network', () => {
      let outboundMailObject = mailchainTestService.outboundMailObject()
      let network = "mytestnet"
      let response = sendService.sendMail(outboundMailObject,network)
      let url = `http://127.0.0.1:8080/api/messages?protocol=ethereum&network=${network}`
      let body = null

      response.subscribe(res => {                
        expect(res["url"]).toEqual(url)
      })

      // handle open connections
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toBe("POST");
      req.flush(body);
    })

    it('should specify envelope type "0x01" in the outbound mail', () => {
      let outboundMailObject = mailchainTestService.outboundMailObject()
      expect(outboundMailObject.envelope).toBe("0x01")
    })

    it('should error on send if envelope type is empty in the outbound mail', () => {
      // TODO add test for: should error on send if envelope type is empty in the outbound mail
      // let outboundMailObject = mailchainTestService.outboundMailObject()
      // outboundMailObject.envelope = ""
    })

    it('should specify encryption-method-name as "aes256cbc" in the outbound mail', () => {
      let outboundMailObject = mailchainTestService.outboundMailObject()
      expect(outboundMailObject["encryption-method-name"]).toBe("aes256cbc")
    })

    it('should error on send if encryption-method-name is empty in the outbound mail', () => {
      // TODO add test for: should error on send if encryption-method-name is empty in the outbound mail
      // let outboundMailObject = mailchainTestService.outboundMailObject()
      // outboundMailObject["encryption-method-name"] = ""
    })
  })
});
