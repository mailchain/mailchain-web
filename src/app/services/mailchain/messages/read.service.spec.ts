import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHelpersService } from '../../helpers/http-helpers/http-helpers.service';

import { ReadService } from './read.service';

describe('ReadService', () => {
  let readService: ReadService;
  let httpTestingController: HttpTestingController;

  const message_id = "32eb5d3bdb59a0a3f30e29d4b4073c960b47"
  const desiredUrl = `http://127.0.0.1:8080/api/messages/${message_id}/read`


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReadService,
        HttpHelpersService,
      ],
      imports: [HttpClientTestingModule]
    });

    readService = TestBed.inject(ReadService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(readService).toBeTruthy();
  });

  describe('markRead', () => {

    it('should return 200 code when PUT is used to mark unread message as read', () => {
      let response = readService.markRead(message_id)

      response.subscribe(res => {
        expect(res["url"]).toEqual(desiredUrl)
        expect(res["status"]).toEqual(200)
      })

      // handle open connections
      const req = httpTestingController.expectOne(desiredUrl);
      expect(req.request.method).toBe("PUT");
      req.flush(response);

    });
  });

  describe('markUnread', () => {
    it('should return 200 code when DELETE is used to mark a read message as unread', () => {
      let response = readService.markUnread(message_id)

      response.subscribe(res => {
        expect(res["url"]).toEqual(desiredUrl)
        expect(res["status"]).toEqual(200)
      })

      // handle open connections
      const req = httpTestingController.expectOne(desiredUrl);
      expect(req.request.method).toBe("DELETE");
      req.flush(response);
    });
  });

  describe('urlHelper', () => {
    it('should return the correct url given a message id', () => {

      let response = readService.urlHelper(message_id)

      expect(response).toEqual(desiredUrl);
    });
  });

  describe('initUrl', () => {
    it('should initialize the url', () => {
      let readService: ReadService = TestBed.inject(ReadService)
      expect(readService['url']).toEqual('http://127.0.0.1:8080/api')
    });
  })

  describe('urlHelper', () => {
    it('should return the url containing the message id', () => {
      let readService: ReadService = TestBed.inject(ReadService)
      expect(readService.urlHelper("12345")).toEqual('http://127.0.0.1:8080/api/messages/12345/read')
    });
  })




});
