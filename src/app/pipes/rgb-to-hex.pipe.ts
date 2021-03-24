import { Pipe, PipeTransform } from '@angular/core';
import { Color3, Light, Mesh, StandardMaterial } from 'babylonjs';

@Pipe({
  name: 'rgbToHex'
})
export class RgbToHexPipe implements PipeTransform {

  transform(value: Mesh | Light, property: string): String {
    if (value === null || value === undefined) return;
    let c: Color3;

    if (value instanceof Mesh) {
      let mat = (<StandardMaterial>value.material);
      if (property === "AMBIENTCOLOR") { c = mat.ambientColor; }
      if (property === "DIFFUSECOLOR") { c = mat.diffuseColor; }
      if (property === "EMISSIVECOLOR") { c = mat.emissiveColor; }
      if (property === "SPECULARCOLOR") { c = mat.specularColor; }
    } else {
      if (property === "DIFFUSECOLOR") { c = value.diffuse; }
      if (property === "SPECULARCOLOR") { c = value.specular; }
    }

    return this.rgbToHex(c.r * 255, c.g * 255, c.b * 255);
  }

  rgbToHex(r, g, b) {
    var rgb = b | (g << 8) | (r << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }
}