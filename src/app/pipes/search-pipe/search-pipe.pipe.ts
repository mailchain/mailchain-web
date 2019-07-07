import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe',
  pure: false,
})
export class SearchPipe implements PipeTransform {
  /**
   * Filters and returns messages with the search term in 'sender', 'subject' or 'body' fields
   * @param value the object to search
   * @param args the serch term
   */
  transform(value: any, args: any): any {
    const searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(mail => {
        var result = false;

        [
          mail["headers"]["from"],
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
