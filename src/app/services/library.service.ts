import { FontType } from './../engine/Text/FontType';
import { Injectable } from '@angular/core';
import { Color3, Mesh, StandardMaterial } from 'babylonjs';
import { Container } from '../engine/common/Container';
import { EngineService } from '../engine/engine.service';
import { TextType } from '../engine/Text/TextType';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private es: EngineService) { }

  createNewGeometryText(): void {
    let font = new FontType();
    font.load("assets/font/Ubuntu-L.ttf", this.es, (fontType: FontType) => {

      let mesh = new Mesh("text", this.es.getScene());
      let mat: StandardMaterial = new StandardMaterial("material", this.es.getScene());
      mat.diffuseColor = new Color3(.0, .75, .75);
      mesh.material = mat;

      let text: TextType = new TextType(font, "Text", mesh);
      let c: Container = new Container(mesh);

      c.isText = true;
      c.text = text;
      c.panel = null;

      this.es.typeToContainer.set(c.type, c);
      this.es.UUIDToContainer.set(c.UUID, c);
      this.es.saveContainerToDataTree(c);
    });
  }
}
