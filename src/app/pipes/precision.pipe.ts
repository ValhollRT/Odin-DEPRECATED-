import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../engine/Utils/Utils';

@Pipe({
  name: 'precision'
})
export class PrecisionPipe implements PipeTransform {

  transform(value: number): number {
    return Utils.precision(value, 3);
  }

}
