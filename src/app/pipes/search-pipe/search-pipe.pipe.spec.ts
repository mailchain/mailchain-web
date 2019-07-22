import { SearchPipe } from './search-pipe.pipe';
import { TestBed } from '@angular/core/testing';

let pipe: SearchPipe

const addr1 = '0x7777777777777777777777777777777777777777'
const addr2 = '0x4444444444444444444444444444444444444444'

const messages = [
  {
    "headers": {
      "date": "2019-06-07T14:53:36Z",
      "from": "\u003c" + addr1 + '@testnet.ethereum\u003e',
      "to": "\u003c" + addr2 + '@testnet.ethereum\u003e',
      "message-id": "001"
    },
    "body": "This is a body to be found",
    "subject": "This is a subject NOT to be found"
  },
  {
    "headers": {
      "date": "2019-06-07T14:53:36Z",
      "from": "\u003c" + addr2 + '@testnet.ethereum\u003e',
      "to": "\u003c" + addr1 + '@testnet.ethereum\u003e',
      "message-id": "002"
    },
    "body": "This is a body NOT to be found",
    "subject": "This is a subject to be found"
  }
]

describe('SearchPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchPipe
      ],
      imports: []
    });
    
    pipe = TestBed.get(SearchPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should search the "sender" field', () => {
    let result = [
      messages[0],
    ]
    
    expect(pipe.transform(messages, addr1).length).toEqual(1);
    expect(pipe.transform(messages, addr1)).toEqual(result);
  })
  
  it('should search the "subject" field', () => {
    let result = [
      messages[1],
    ]
    let str = "This is a subject to be found"
    expect(pipe.transform(messages, str).length).toEqual(1);
    expect(pipe.transform(messages, str)).toEqual(result);
  })
  
  it('should search the "body" field', () => {
    let result = [
      messages[0],
    ]
    let str = "This is a body to be found"
    expect(pipe.transform(messages, str).length).toEqual(1);
    expect(pipe.transform(messages, str)).toEqual(result);
  })
  
  it('should NOT search the "to" field', () => {
    let result = [
      messages[1]
    ]
    
    expect(pipe.transform(messages, addr1).length).not.toEqual(2);
    expect(pipe.transform(messages, addr1)).not.toEqual(result);
  })
  
  it('should NOT search the "date" field', () => {
    let result = [
      messages[1],
    ]
    let str = messages[1]["headers"]["date"]

    expect(pipe.transform(messages, str).length).toEqual(0);
    expect(pipe.transform(messages, str)).toEqual([]);
  
  })
});
