import { Injectable } from '@angular/core';
import { Color3, DirectionalLight, HemisphericLight, Light, LightGizmo, Mesh, MeshBuilder, PointLight, Scene, SpotLight, StandardMaterial, Vector3 } from "babylonjs";
import { GEOM, LIGHT } from 'src/app/configuration/AppConstants';
import { CanvasHelper } from '../helpers/CanvasHelper';
@Injectable({ providedIn: 'root' })

export class ElementBuilder {

    constructor() { }

    static createMesh(type: string, scene: Scene): Mesh {
        let mesh = this.setMesh(type, scene);
        let mat: StandardMaterial = new StandardMaterial("material", scene);
        mesh.material = mat;
        mat.diffuseColor = new Color3(.75, .75, .75);
        return mesh;
    }

    static setMesh(type: string, s: Scene, options?: any): Mesh {
        switch (type) {
            case GEOM.BOX:
                return MeshBuilder.CreateBox("box", { height: 10, width: 10, depth: 10 }, s);
            case GEOM.CYLINDER:
                return MeshBuilder.CreateCylinder("cylinder", { diameter: 10 }, s);
            case GEOM.DISC:
                return MeshBuilder.CreateDisc("disc", { radius: 20, tessellation: 3 }, s);
            case GEOM.ICOSPHERE:
                return MeshBuilder.CreateIcoSphere("icosphere", {}, s);
            case GEOM.PLANE:
                return MeshBuilder.CreatePlane("plane", { size: 10, width: 10, height: 10 }, s);
            case GEOM.POLYHEDRON:
                return MeshBuilder.CreatePolyhedron("polyhedron", {}, s);
            case GEOM.TORUS:
                return MeshBuilder.CreateTorus("torus", {}, s);
            case GEOM.TUBE:
                break;
            case GEOM.RIBBON:
                break;
            case GEOM.SPHERE:
                return MeshBuilder.CreateSphere("sphere", { diameter: 10 }, s);
        }
    }

    setHighLight() {
        /*
        Container.highLight = new HighlightLayer("highLight", scene);
        Container.highLight.outerGlow = true;
        Container.highLight.blurHorizontalSize = 1;
        Container.highLight.blurVerticalSize = 1;
        Container.highLight.innerGlow = false;
        */
    }

    static createLight(type: string, scene: Scene) {
        let light = this.setLight(type, scene);
        CanvasHelper.lightGizmo.light = light;
        return light;
    }

    static setLight(type: string, s: Scene, options?: any): Light {
        switch (type) {
            case LIGHT.DIRECTIONAL:
                return new DirectionalLight("DirectionalLight", new Vector3(0, 0, 0), s);
            case LIGHT.SPOT:
                return new SpotLight("SpotLight", Vector3.Zero(), new Vector3(0, -1, 0), 20, 1, s);
            case LIGHT.POINT:
                return new PointLight("PointLight", new Vector3(0, 0, 0), s);
            case LIGHT.HEMISPHERIC:
                return new HemisphericLight("HemisphericLight", new Vector3(0, 0, 0), s);

        }
    }
}