import {
	ActionManager,
	ArcRotateCamera,
	Color3,
	DynamicTexture,
	Engine,
	ExecuteCodeAction,
	HemisphericLight,
	Mesh,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3,
	Viewport
} from 'babylonjs';

export class GizmoHelper {

	public sceneGizmo: Scene;
	public cameraGizmo: ArcRotateCamera;
	public pxChar;
	public mxChar;
	public pyChar;
	public myChar;
	public pzChar;
	public mzChar;
	public xplus;
	public xminus;
	public yplus;
	public yminus;
	public zplus;
	public zminus;
	public box;

	constructor(public engine: Engine, viewportCamera: ArcRotateCamera) {
		this.sceneGizmo = new Scene(engine);
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

		this.box = Mesh.CreateBox("box", 8, this.sceneGizmo);
		this.box.material = boxMat;

		// X Axi
		this.xplus = MeshBuilder.CreateCylinder("xplus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);
		this.xminus = MeshBuilder.CreateCylinder("xminus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);

		this.pxChar = this.makeTextPlane("+X", "red", 7, this.sceneGizmo);
		this.pxChar.position = new Vector3(18, 0, 0);
		this.mxChar = this.makeTextPlane("-X", "red", 7, this.sceneGizmo);
		this.mxChar.position = new Vector3(-18, 0, 0);

		this.xplus.rotation.z = BABYLON.Tools.ToRadians(-90);
		this.xplus.position.x = -8;
		this.xplus.material = redMat;
		this.xminus.rotation.z = BABYLON.Tools.ToRadians(90);
		this.xminus.position.x = 8;
		this.xminus.material = redMat;

		// Y Axi
		this.yminus = MeshBuilder.CreateCylinder("yplus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);
		this.yplus = MeshBuilder.CreateCylinder("yminus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);

		this.pyChar = this.makeTextPlane("+Y", "lime", 7, this.sceneGizmo);
		this.pyChar.position = new Vector3(0, 18, 0);
		this.myChar = this.makeTextPlane("-Y", "lime", 7, this.sceneGizmo);
		this.myChar.position = new Vector3(0, -18, 0);

		this.yminus.rotation.x = BABYLON.Tools.ToRadians(0);
		this.yminus.position.y = -8;
		this.yminus.material = greenMat;
		this.yplus.rotation.x = BABYLON.Tools.ToRadians(180);
		this.yplus.position.y = 8;
		this.yplus.material = greenMat;

		// Z Axi
		this.zplus = MeshBuilder.CreateCylinder("zplus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);
		this.zminus = MeshBuilder.CreateCylinder("zminus", { diameterBottom: 8, diameterTop: 0, tessellation: 6, height: 10 }, this.sceneGizmo);

		this.pzChar = this.makeTextPlane("+Z", "cyan", 7, this.sceneGizmo);
		this.pzChar.position = new Vector3(0, 0, 18);
		this.mzChar = this.makeTextPlane("-Z", "cyan", 7, this.sceneGizmo);
		this.mzChar.position = new Vector3(0, 0, -18);

		this.zplus.rotation.x = BABYLON.Tools.ToRadians(-90);
		this.zplus.position.z = 8;
		this.zplus.material = blueMat;
		this.zminus.rotation.x = BABYLON.Tools.ToRadians(90);
		this.zminus.position.z = -8;
		this.zminus.material = blueMat;

		this.sceneGizmo.onReadyObservable.add(() => {
			for (var i = 0; i < this.sceneGizmo.meshes.length; i++) {
				let mesh = this.sceneGizmo.meshes[i];

				mesh.isPickable = true;
				mesh.actionManager = new ActionManager(this.sceneGizmo);
				mesh.actionManager.registerAction(
					new ExecuteCodeAction(ActionManager.OnPickTrigger, o => {
						if (mesh.name === 'xplus') { viewportCamera.position = new Vector3(-500, 0, 0); }
						if (mesh.name === 'yplus') { viewportCamera.position = new Vector3(0, -500, 0); }
						if (mesh.name === 'zplus') { viewportCamera.position = new Vector3(0, 0, -500); }
						if (mesh.name === 'xminus') { viewportCamera.position = new Vector3(500, 0, 0); }
						if (mesh.name === 'yminus') { viewportCamera.position = new Vector3(0, 500, 0); }
						if (mesh.name === 'zminus') { viewportCamera.position = new Vector3(0, 0, 500); }
						viewportCamera.cameraDirection = Vector3.Zero();
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

	setEnabled(enabled: boolean) {
		this.pxChar.isVisible = enabled;
		this.mxChar.isVisible = enabled;

		this.pyChar.isVisible = enabled;
		this.myChar.isVisible = enabled;

		this.pzChar.isVisible = enabled;
		this.mzChar.isVisible = enabled;

		this.xplus.isVisible = enabled;
		this.xminus.isVisible = enabled;

		this.yplus.isVisible = enabled;
		this.yminus.isVisible = enabled;
		
		this.zplus.isVisible = enabled;
		this.zminus.isVisible = enabled;

		this.box.isVisible = enabled;

	}
}
