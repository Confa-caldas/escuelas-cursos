import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indicationEmail'
})
export class IndicationEmailPipe implements PipeTransform {

  transform(value: string, active: boolean = true): string {
    if(active) {
      let emailHide = "";
      let email = value.split('@');
      let part1 = email[0];
      let part2 = email[1];
      let part1Show = part1.slice(0,2);

      for (let i = 2; i < part1.length; i++) {
        emailHide += "*";
      }
      let newEmail = part1Show + emailHide + "@" + part2;
      return newEmail;
    }
    else {
      return value;
    }
  }

}
