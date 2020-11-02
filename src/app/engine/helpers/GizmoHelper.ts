import {
	ArcRotateCamera,
	Color3,
	Engine,
	HemisphericLight,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3,
	Viewport
} from 'babylonjs';

export class GizmoHelper {

	public sceneGizmo: Scene;
	public cameraGizmo: ArcRotateCamera;

	constructor(public engine: Engine) {
		this.sceneGizmo = new Scene(engine);
		this.sceneGizmo.autoClear = false;

		this.cameraGizmo = new ArcRotateCamera("cameraGizmo", 0, 0, 100, new Vector3(0, 0, 0), this.sceneGizmo);
		this.cameraGizmo.lowerRadiusLimit = 100;
		this.cameraGizmo.upperRadiusLimit = 100;
		this.cameraGizmo.viewport = new Viewport(0.85, 0, 0.2, 0.2);
		let light = new HemisphericLight("HemisphericLight", new Vector3(0, 0, 0), this.sceneGizmo);
		light.intensity = 1.5;

		// This attaches the camera to the canvas
		// this.cameraGizmo.attachControl(engine.getRenderingCanvas(), true, true);
		// var boxGizmo = MeshBuilder.CreateBox("cubeGizmo", { size: 25 }, this.sceneGizmo);
		var redMat = new StandardMaterial("redMat", this.sceneGizmo);
		redMat.diffuseColor = new Color3(1, 0, 0);
		redMat.specularColor = new Color3(0.1, 0.1, 0.1);
		var greenMat = new StandardMaterial("greenMat", this.sceneGizmo);
		greenMat.diffuseColor = new Color3(0, 1, 0);
		greenMat.specularColor = new Color3(0.1, 0.1, 0.1);
		var blueMat = new StandardMaterial("blueMat", this.sceneGizmo);
		blueMat.diffuseColor = new Color3(0, 0, 1);
		blueMat.specularColor = new Color3(0.1, 0.1, 0.1);

		// X Axi
		var xplus = MeshBuilder.CreateCylinder("xplus", { diameterBottom: 10, diameterTop: 0, tessellation: 3, height: 15 }, this.sceneGizmo);
		var xminus = MeshBuilder.CreateCylinder("xminus", { diameterBottom: 10, diameterTop: 0, tessellation: 3, height: 15 }, this.sceneGizmo);
		xplus.rotation.x = BABYLON.Tools.ToRadians(90);
		xplus.position.z = -8;
		xplus.material = redMat;
		xminus.rotation.x = BABYLON.Tools.ToRadians(-90);
		xminus.position.z = 8;
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
		zplus.rotation.z = BABYLON.Tools.ToRadians(90);
		zplus.position.x = 8;
		zplus.material = blueMat;
		zminus.rotation.z = BABYLON.Tools.ToRadians(-90);
		zminus.position.x = -8;
		zminus.material = blueMat;
	}

	getScene() { return this.sceneGizmo; }

	getCamera() { return this.cameraGizmo; }

}
