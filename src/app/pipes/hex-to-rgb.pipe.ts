import { Pipe, PipeTransform } from '@angular/core';
import { Color3 } from 'babylonjs';

@Pipe({
  name: 'hexToRgb'
})
export class HexToRgbPipe implements PipeTransform {

  transform(value: string): Color3 {
    return Color3.FromHexString(value);
  }
}
