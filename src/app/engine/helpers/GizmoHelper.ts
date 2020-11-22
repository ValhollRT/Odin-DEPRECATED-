import { Injectable } from '@angular/core';
import {
	ActionManager,
	ArcRotateCamera,
	Color3,
	ExecuteCodeAction,
	HemisphericLight,
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

		var redMat = new StandardMaterial("redMat", this.sceneGizmo);
		redMat.freeze();
		redMat.diffuseColor = new Color3(1, 0, 0);
		redMat.specularColor = new Color3(0.1, 0.1, 0.1);
		var greenMat = new StandardMaterial("greenMat", this.sceneGizmo);
		greenMat.freeze();
		greenMat.diffuseColor = new Color3(0, 1, 0);
		greenMat.specularColor = new Color3(0.1, 0.1, 0.1);
		var blueMat = new StandardMaterial("blueMat", this.sceneGizmo);
		blueMat.freeze();
		blueMat.diffuseColor = new Color3(0, 0, 1);
		blueMat.specularColor = new Color3(0.1, 0.1, 0.1);

		// X Axi
		var xplus = MeshBuilder.CreateCylinder("xplus", { diameterBottom: 10, diameterTop: 0, tessellation: 3, height: 15 }, this.sceneGizmo);
		var xminus = MeshBuilder.CreateCylinder("xminus", { diameterBottom: 10, diameterTop: 0, tessellation: 3, height: 15 }, this.sceneGizmo);
		xplus.rotation.z = BABYLON.Tools.ToRadians(-90);
		xplus.position.x = -8;
		xplus.material = redMat;
		xminus.rotation.z = BABYLON.Tools.ToRadians(90);
		xminus.position.x = 8;
		xminus.material = redMat;

		// Y Axi
		var yminus = MeshBuilder.CreateCylinder("yplus", { diameterBottom: 10, diameterTop: 0, tessellation: 3, height: 15 }, this.sceneGizmo);
		var yplus = MeshBuilder.CreateCylinder("yminus", { diameterBottom: 10, diameterTop: 0, tessellation: 3, height: 15 }, this.sceneGizmo);
		yminus.rotation.x = BABYLON.Tools.ToRadians(0);
		yminus.position.y = -8;
		yminus.material = greenMat;
		yplus.rotation.x = BABYLON.Tools.ToRadians(180);
		yplus.position.y = 8;
		yplus.material = greenMat;

		// Z Axi
		var zplus = MeshBuilder.CreateCylinder("zplus", { diameterBottom: 10, diameterTop: 0, tessellation: 3, height: 15 }, this.sceneGizmo);
		var zminus = MeshBuilder.CreateCylinder("zminus", { diameterBottom: 10, diameterTop: 0, tessellation: 3, height: 15 }, this.sceneGizmo);
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

	getScene() { return this.sceneGizmo; }

	getCamera() { return this.cameraGizmo; }

}
