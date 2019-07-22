import { Pipe, PipeTransform } from '@angular/core';

import { MailchainService } from 'src/app/services/mailchain/mailchain.service';

@Pipe({
  name: 'addressPipe',
  pure: false,
})

export class AddressPipe implements PipeTransform {
  constructor(
    private mailchainService: MailchainService,
  ){}

  /**
   * Filters and returns messages sent to a particular address using the 'to' field
   * @param value array of messages
   * @param args the address to filter by
   */
  transform(value: any, args: any): any {
    var address = args;
    
    if (value) {
      return value.filter(conversation => {
        return (address.toLowerCase() == this.mailchainService.parseAddressFromMailchain(conversation["headers"]["to"]).toLowerCase() );
      });
    }
  }
}

