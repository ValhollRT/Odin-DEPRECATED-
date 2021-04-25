import { Pipe, PipeTransform } from '@angular/core';
import { Color3 } from 'babylonjs';
import { PlugMaterial } from '../engine/plugs/plug-material';

@Pipe({
  name: 'rgbToHex'
})
export class RgbToHexPipe implements PipeTransform {

  transform(value: Color3): String {
    if (value === null || value === undefined) return;
    return this.rgbToHex(value.r * 255, value.g * 255, value.b * 255);
  }

  rgbToHex(r, g, b) {
    var rgb = b | (g << 8) | (r << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }
}