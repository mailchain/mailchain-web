import { Pipe, PipeTransform } from '@angular/core';

import { MailchainService } from 'src/app/services/mailchain/mailchain.service';
import { AddressesService } from 'src/app/services/mailchain/addresses/addresses.service';

@Pipe({
  name: 'addressPipe',
  pure: false,
})

export class AddressPipe implements PipeTransform {
  constructor(
    private mailchainService: MailchainService,
    private addressesService: AddressesService,
  ) { }

  /**
   * Filters and returns messages sent to a particular address using the 'to' field
   * @param value array of messages
   * @param args a hash: {
      protocol: protocol_value,
      address: address_value
    }
   */
  transform(value: any, args: any): any {

    let protocol = args['protocol']
    let fromAddress = this.addressesService.handleAddressFormatting(args['address'], protocol);

    if (value) {
      return value.filter(conversation => {
        let toAddress = this.mailchainService.parseAddressFromMailchain(protocol, conversation["headers"]["to"])

        return fromAddress == this.addressesService.handleAddressFormatting(toAddress, protocol);
      });
    }
  }
}

