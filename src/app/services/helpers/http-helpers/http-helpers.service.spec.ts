import { TestBed } from '@angular/core/testing';
import { HttpHelpersService } from './http-helpers.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

let queryParams = [['myKey', 'myValue'], ['anotherKey', 'anotherValue']]

describe('HttpHelpersService', () => {
  let httpHelpersService: HttpHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpHelpersService]
    });

    httpHelpersService = TestBed.inject(HttpHelpersService);
  });


  it('should be created', () => {
    expect(httpHelpersService).toBeTruthy();
  });

  describe('getHttpOptions', () => {
    it('should have a header: Content-Type equal to application/json', () => {
      expect(httpHelpersService.getHttpOptions().headers.get('Content-Type')).toEqual('application/json')
    })

    it('should get the httpOptions without query params', () => {
      expect(httpHelpersService.getHttpOptions().params.keys()).toEqual([])
    });


    it('should get the httpOptions with query params', () => {
      expect(httpHelpersService.getHttpOptions(queryParams).params.keys()).toEqual(['myKey', 'anotherKey'])
      expect(httpHelpersService.getHttpOptions(queryParams).params.toString()).toEqual('myKey=myValue&anotherKey=anotherValue')
      expect(httpHelpersService.getHttpOptions(queryParams).params.get('myKey')).toEqual('myValue')
    })
  });

  describe('setParams', () => {
    it('should return httpOptions from setParams without query params', () => {
      let httpOptions = {};
      let expectedObj = new HttpParams

      expect(httpHelpersService.setParams(httpOptions).params).toEqual(expectedObj)
    })
    it('should return httpOptions from setParams with query params', () => {
      let httpOptions = {};

      expect(httpHelpersService.setParams(httpOptions, queryParams).params.keys()).toEqual(['myKey', 'anotherKey'])

      expect(httpHelpersService.setParams(httpOptions, queryParams).params.toString()).toEqual('myKey=myValue&anotherKey=anotherValue')

      expect(httpHelpersService.setParams(httpOptions, queryParams).params.get('myKey')).toEqual('myValue')

    })
  });

});
