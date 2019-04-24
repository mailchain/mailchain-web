import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe',
  pure: false,
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(mail => {
        var result = false;

        [
          mail["sender"],
          mail["subject"],
          mail["body"],
        ].forEach(el => {
          if (
            el != undefined &&
            el.search(searchText) !== -1
          ) {
            result = true
          }
        });
        return result
      });
    }
  }
}
