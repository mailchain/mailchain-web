import { TestBed } from '@angular/core/testing';
import { AddressPipe } from './address-pipe.pipe';

let pipe: AddressPipe

const addr1 = '0x0000000000000000000000000000000000000000'
const addr2 = '0x0123456789abcdef0123456789abcdef01234567'
const addr3 = '0x1111111111111111111111111111111111111111'

const messages = [
  {
    "headers": {
      "from": "\u003c" + addr1 + '@testnet.ethereum\u003e',
      "to": "\u003c" + addr2 + '@testnet.ethereum\u003e',
      "message-id": "001"
    },
    "body": "",
    "subject": "Msg 1: 1 sends to 2"
  },
  {
    "headers": {
      "from": "\u003c" + addr2 + '@testnet.ethereum\u003e',
      "to": "\u003c" + addr1 + '@testnet.ethereum\u003e',
      "message-id": "002"
    },
    "body": "",
    "subject": "Msg 2: 2 sends to 1"
  },
  {
    "headers": {
      "from": "\u003c" + addr1 + '@testnet.ethereum\u003e',
      "to": "\u003c" + addr2 + '@testnet.ethereum\u003e',
      "message-id": "003"
    },
    "body": "",
    "subject": "Msg 1: 1 sends to 2 again"
  },
]

describe('AddressPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressPipe
      ],
      imports: []
    });
    
    pipe = TestBed.get(AddressPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return filtered messages when 1 message has been sent to an address', () => {
    let result = [
      messages[1],
    ]

    expect(pipe.transform(messages, addr1).length).toEqual(1);
    expect(pipe.transform(messages, addr1)).toEqual(result);
  });
  
  it('should return filtered messages when >1 message has been sent to an address', () => {
    let result = [
      messages[0],
      messages[2],
    ]
    expect(pipe.transform(messages, addr2).length).toEqual(2);
    expect(pipe.transform(messages, addr2)).toEqual(result);
  });
  
  it('should return empty array when no messages exist for address', () => {
    let result = []
    expect(pipe.transform(messages, addr3).length).toEqual(0);
    expect(pipe.transform(messages, addr3)).toEqual(result);
  });
});
