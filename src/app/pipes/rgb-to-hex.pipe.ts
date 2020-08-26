import { Pipe, PipeTransform } from '@angular/core';
import { Color3, Material, Mesh, StandardMaterial } from 'babylonjs';

@Pipe({
  name: 'rgbToHex'
})
export class RgbToHexPipe implements PipeTransform {

  transform(value: Mesh, property: string): String {
    if (value === null || value === undefined) return;

    let mat = (<StandardMaterial>value.material);
    let c: Color3;

    if (property === "AMBIENTCOLOR") { c = mat.ambientColor; }
    if (property === "DIFFUSECOLOR") { c = mat.diffuseColor; }
    if (property === "EMISSIVECOLOR") { c = mat.emissiveColor; }
    if (property === "SPECULARCOLOR") { c = mat.specularColor; }

    return this.rgbToHex(c.r * 255, c.g * 255, c.b * 255);
  }

1
  rgbToHex(r, g, b) {
    var rgb = b | (g << 8) | (r << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }

}
