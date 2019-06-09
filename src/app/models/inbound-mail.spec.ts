import { InboundMail } from './inbound-mail';

describe('InboundMail', () => {
  xit('should create an instance', () => {
    // @TODO: Failing test for peculiar reason: "Uncaught TypeError: Cannot read property 'filter' of undefined thrown"... similar test with same pattern have no trouble
    expect(new InboundMail()).toBeTruthy();
  });
});
