import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../engine/Utils/Utils';

@Pipe({
  name: 'rotation'
})
export class RotationPipe implements PipeTransform {

  transform(value: number, pipeArgs: any[]): number {
    return Utils.precision(Utils.radiansToDegrees(value), 3);
  }
}
