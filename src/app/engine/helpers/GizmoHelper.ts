import { Injectable } from '@angular/core';
import {
	ActionManager,
	ArcRotateCamera,
	Color3,
	DynamicTexture,
	ExecuteCodeAction,
	HemisphericLight,
	Mesh,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3,
	Viewport
} from 'babylonjs';
import { EngineService } from '../engine.service';

@Injectable()
export class GizmoHelper {

	public sceneGizmo: Scene;
	public cameraGizmo: ArcRotateCamera;

	constructor(public es: EngineService) {
		this.sceneGizmo = new Scene(this.es.getEngine());
		this.sceneGizmo.autoClear = false;

		this.cameraGizmo = new ArcRotateCamera("cameraGizmo", 0, 0, 100, new Vector3(0, 0, 0), this.sceneGizmo);
		this.cameraGizmo.lowerRadiusLimit = 100;
		this.cameraGizmo.upperRadiusLimit = 100;
		this.cameraGizmo.viewport = new Viewport(0.865, -.04, 0.2, 0.2);
		let light = new HemisphericLight("HemisphericLight", new Vector3(0, 0, 0), this.sceneGizmo);
		light.intensity = 1.5;

		let redMat = new StandardMaterial("redMat", this.sceneGizmo);
		redMat.freeze();
		redMat.diffuseColor = new Color3(1, 0, 0);
		redMat.specularColor = new Color3(0.1, 0.1, 0.1);
		let greenMat = new StandardMaterial("greenMat", this.sceneGizmo);
		greenMat.freeze();
		greenMat.diffuseColor = new Color3(0, 1, 0);
		greenMat.specularColor = new Color3(0.1, 0.1, 0.1);
		let blueMat = new StandardMaterial("blueMat", this.sceneGizmo);
		blueMat.freeze();
		blueMat.diffuseColor = new Color3(0.2, .7, 1);
		blueMat.specularColor = new Color3(0.1, 0.1, 0.1);
		let boxMat = new StandardMaterial("blueMat", this.sceneGizmo);
		boxMat.freeze();
		boxMat.diffuseColor = new Color3(.5, .5, .6);
		boxMat.specularColor = new Color3(0.1, 0.1, 0.2);

		let box = Mesh.CreateBox("box", 8, this.sceneGizmo);
		box.material = boxMat;

		// X Axi
		var xplus = MeshBuilder.CreateCylinder("xplus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);
		var xminus = MeshBuilder.CreateCylinder("xminus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);

		let pxChar = this.makeTextPlane("+X", "red", 7, this.sceneGizmo);
		pxChar.position = new Vector3(18, 0, 0);
		let mxChar = this.makeTextPlane("-X", "red", 7, this.sceneGizmo);
		mxChar.position = new Vector3(-18, 0, 0);

		xplus.rotation.z = BABYLON.Tools.ToRadians(-90);
		xplus.position.x = -8;
		xplus.material = redMat;
		xminus.rotation.z = BABYLON.Tools.ToRadians(90);
		xminus.position.x = 8;
		xminus.material = redMat;

		// Y Axi
		var yminus = MeshBuilder.CreateCylinder("yplus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);
		var yplus = MeshBuilder.CreateCylinder("yminus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);

		let pyChar = this.makeTextPlane("+Y", "lime", 7, this.sceneGizmo);
		pyChar.position = new Vector3(0, 18, 0);
		let myChar = this.makeTextPlane("-Y", "lime", 7, this.sceneGizmo);
		myChar.position = new Vector3(0, -18, 0);

		yminus.rotation.x = BABYLON.Tools.ToRadians(0);
		yminus.position.y = -8;
		yminus.material = greenMat;
		yplus.rotation.x = BABYLON.Tools.ToRadians(180);
		yplus.position.y = 8;
		yplus.material = greenMat;

		// Z Axi
		var zplus = MeshBuilder.CreateCylinder("zplus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);
		var zminus = MeshBuilder.CreateCylinder("zminus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);

		let pzChar = this.makeTextPlane("+Z", "cyan", 7, this.sceneGizmo);
		pzChar.position = new Vector3(0, 0, 18);
		let mzChar = this.makeTextPlane("-Z", "cyan", 7, this.sceneGizmo);
		mzChar.position = new Vector3(0, 0, -18);

		zplus.rotation.x = BABYLON.Tools.ToRadians(-90);
		zplus.position.z = 8;
		zplus.material = blueMat;
		zminus.rotation.x = BABYLON.Tools.ToRadians(90);
		zminus.position.z = -8;
		zminus.material = blueMat;

		this.sceneGizmo.onReadyObservable.add(() => {
			let cam = this.es.getCamera();
			for (var i = 0; i < this.sceneGizmo.meshes.length; i++) {
				let mesh = this.sceneGizmo.meshes[i];

				mesh.isPickable = true;
				mesh.actionManager = new ActionManager(this.sceneGizmo);
				mesh.actionManager.registerAction(
					new ExecuteCodeAction(ActionManager.OnPickTrigger, o => {
						if (mesh.name === 'xplus') { cam.position = new Vector3(-500, 0, 0); }
						if (mesh.name === 'yplus') { cam.position = new Vector3(0, -500, 0); }
						if (mesh.name === 'zplus') { cam.position = new Vector3(0, 0, -500); }
						if (mesh.name === 'xminus') { cam.position = new Vector3(500, 0, 0); }
						if (mesh.name === 'yminus') { cam.position = new Vector3(0, 500, 0); }
						if (mesh.name === 'zminus') { cam.position = new Vector3(0, 0, 500); }
						cam.cameraDirection = Vector3.Zero();
					}))
			}
		});

	}

	makeTextPlane(text, color, size, scene: Scene) {
		let dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
		dynamicTexture.hasAlpha = true;
		dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
		let plane = Mesh.CreatePlane("TextPlane", size, scene, true);
		let material = new StandardMaterial("TextPlaneMaterial", scene);
		material.backFaceCulling = false;
		material.specularColor = new Color3(0, 0, 0);
		material.diffuseTexture = dynamicTexture;
		plane.material = material;
		plane.billboardMode = 3;
		return plane;
	};

	getScene() { return this.sceneGizmo; }

	getCamera() { return this.cameraGizmo; }

}
