import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ArcRotateCamera,
  BoundingBox,
  Light,
  ScreenshotTools, Vector3
} from 'babylonjs';
import * as FileSaver from 'file-saver';
import { PlugGeometry } from 'src/app/engine/plugs/plug-geometry';
import { PlugSpotLight } from 'src/app/engine/plugs/plug-light/plug-spot-light';
import { EngineService } from 'src/app/services/engine.service';
import { Container } from 'src/app/shared/container/container';
import { LIGHT } from '../configuration/app-constants';
import { PlugAudio } from '../engine/plugs/plug-audio';
import { PlugCamera } from '../engine/plugs/plug-camera';
import { PlugPointLight } from '../engine/plugs/plug-light/plug-point-light';
import { PlugMaterial } from '../engine/plugs/plug-material';
import { PlugTexture } from '../engine/plugs/plug-texture';
import { PlugTransform } from '../engine/plugs/plug-transform';
import { Utils } from '../engine/Utils/Utils';
import { ImageDto } from '../models/ImageDto.model';
import { MaterialDto } from '../models/MaterialDto.model';
import { SceneSettings } from '../models/SceneSettings.model';
import { oneSelection, setSettings } from '../store/actions/engine.actions';
import { AppState } from '../store/app.reducer';
import { PlugDirectionalLight } from './../engine/plugs/plug-light/plug-directional-light';
import { PlugHemisphericLight } from './../engine/plugs/plug-light/plug-hemispheric-light';
import { PlugText } from './../engine/plugs/plug-text';
import { AudioDto } from './../models/AudioDto.model';
import { DatabaseService } from './database.service';


@Injectable({ providedIn: 'root' })
export class AppService {
  public sceneSettings = {
    backgroundColor: '#333335',
    userId: undefined,
  } as SceneSettings;

  // References Containers
  public plugGeometryToContainer = new Map<
    Node | PlugGeometry | Light,
    Container
  >();
  public uuidToContainer = new Map<string, Container>();
  public uuidToBBox = new Map<string, BoundingBox>();
  public uuidToCamera = new Map<string, ArcRotateCamera>();
  public userId: string;

  private selectedUuidContainers: string[];

  constructor(
    public engineServ: EngineService,
    public databaseServ: DatabaseService,
    public store: Store<AppState>
  ) {
    store.select('engine').subscribe((en) => {
      this.selectedUuidContainers = [...en.uuidCsSelected];
    });
    store.select('session').subscribe((session) => {
      if (session.user) this.userId = session.user.uid;
      else this.userId = undefined;
      this.loadSceneSettings().then((settings) => {
        this.store.dispatch(setSettings({ sceneSettings: { ...settings } }));
      });
    });
  }

  /** Default Scene */
  public createDefaultScene() {
    let container = this.newContainer();
    let transformLight = container.getPlugTransform();

    let light = new PlugPointLight(container);
    light.intensity = 0.6;
    container.setPlugLight(light);
    container.name = 'PointLight';
    let x = Utils.degreeToRadians(0);
    let y = Utils.degreeToRadians(-30);
    let z = Utils.degreeToRadians(-90);
    transformLight.rotation = new Vector3(
      Utils.precision(x, 3),
      Utils.precision(y, 3),
      Utils.precision(z, 3)
    );
    transformLight.position = new Vector3(25, 25, -75);

    container = this.newContainer();
    let defaultPlugCamera = new PlugCamera(container);
    defaultPlugCamera.active = true;
    container.setPlugCamera(defaultPlugCamera);
    container.name = 'Camera';
    this.engineServ.setCamera(defaultPlugCamera);
  }

  /** Settings */
  async loadSceneSettings(): Promise<SceneSettings> {
    if (this.userId === undefined || this.userId === null) {
      return this.loadDefaultSceneSettings();
    }

    let userDocId = await this.databaseServ.getUserDocId(this.userId);
    let setting = await this.databaseServ.getSceneSettings(this.userId);
    if (setting.docs.length == 1) {
      return setting.docs[0].data() as SceneSettings;
    } else {
      return this.loadDefaultSceneSettings();
    }
  }

  loadDefaultSceneSettings() {
    this.sceneSettings.backgroundColor = '#333335';
    this.sceneSettings.userId = undefined;
    return this.sceneSettings;
  }

  setSceneSettings(settings: SceneSettings): void {
    this.sceneSettings = { ...settings, userId: this.userId };
    this.databaseServ.setSceneSettings(this.sceneSettings);
    this.store.dispatch(
      setSettings({ sceneSettings: { ...this.sceneSettings } })
    );
  }

  /** Generate Containers and Plugs */
  newContainer(): Container {
    let container = new Container();
    container.setPlugTransform(new PlugTransform());
    this.addContainerToMapScene(container);

    this.engineServ.emitNewContainerTreeNode$.next(container);
    return container;
  }

  addPlugGeometry(geomType: any): void {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    let pg = new PlugGeometry(container, geomType);
    container.setPlugGeometry(pg);
    this.addPlugGeometryToMapScene(container);
  }

  addDefaultMaterial() {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    container.setPlugMaterial(new PlugMaterial(container));
  }

  addPlugMaterialFromDto(material: MaterialDto) {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    container.setPlugMaterial(PlugMaterial.fromDto(material, container));
    this.updateSidebarData(container.uuid);
  }

  addPlugTextureFromDto(image: ImageDto) {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    container.setPlugTexture(PlugTexture.fromDto(image.url, container));
  }

  addPlugAudioFromDto(audio: AudioDto) {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    container.setPlugAudio(PlugAudio.fromDto(audio.guid, container));
  }

  addPlugLight(lightType: any) {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    let pl;
    switch (lightType) {
      case LIGHT.DIRECTIONAL:
        container.setPlugLight((pl = new PlugDirectionalLight(container)));
        break;
      case LIGHT.SPOT:
        container.setPlugLight((pl = new PlugSpotLight(container)));
        break;
      case LIGHT.POINT:
        container.setPlugLight((pl = new PlugPointLight(container)));
        break;
      case LIGHT.HEMISPHERIC:
        container.setPlugLight((pl = new PlugHemisphericLight(container)));
        break;
    }
    this.addContainerToMapScene(container);
  }

  addPlugCamera() {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    container.setPlugCamera(new PlugCamera(container));
    this.addContainerToMapScene(container);
  }

  async addPlugText(url: string) {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    container.setPlugGeometry(new PlugText(container, url));
    container.name = 'Text';
    this.addPlugGeometryToMapScene(container);
  }

  removePlugSelectedFromContainer(
    containerPlugUuidSelected: string,
    plugUuidSelected: string
  ) {
    let container = this.getContainerFromUuid(containerPlugUuidSelected);
    if (!!plugUuidSelected) container.removePlug(plugUuidSelected);
  }

  clonePlugFromClipboardToContainer(
    plugUuidSelected: string,
    containerPlugUuidSelected: string
  ) {
    if (this.noSelected()) return;
    let containerTopaste = this.getFirstSelected();
    let containerPlug = this.getContainerFromUuid(containerPlugUuidSelected);
    let plugToClone = containerPlug.plugs.filter(
      (plug) => plug.uuid == plugUuidSelected
    )[0];
    let plugCloned = plugToClone.copy(containerTopaste);

    if (plugCloned instanceof PlugTransform) return; // PlugTransform is only copied trasnform values
    if (plugCloned instanceof PlugCamera) return; // not applied to container
    if (plugCloned instanceof PlugText) return; // not applied to container

    if (plugCloned instanceof PlugTransform)
      containerTopaste.setPlugTransform(plugCloned);
    if (plugCloned instanceof PlugGeometry) {
      containerTopaste.setPlugGeometry(plugCloned);
      this.addPlugGeometryToMapScene(containerTopaste);
    }

    if (plugCloned instanceof PlugMaterial)
      containerTopaste.setPlugMaterial(plugCloned);
    if (
      plugCloned instanceof
      (PlugDirectionalLight ||
        PlugSpotLight ||
        PlugPointLight ||
        PlugHemisphericLight)
    )
      containerTopaste.setPlugLight(plugCloned);
    if (plugCloned instanceof PlugTexture)
      containerTopaste.setPlugTexture(plugCloned);
    if (plugCloned instanceof PlugAudio)
      containerTopaste.setPlugAudio(plugCloned);
  }

  /** References Containers */
  public getContainerFromUuid(uuid: string): Container {
    return this.uuidToContainer.get(uuid);
  }
  public getContainerFromPlugGeometry(type: Node | PlugGeometry): Container {
    return this.plugGeometryToContainer.get(type);
  }

  // Get Selections methods
  public noSelected(): boolean {
    return this.selectedUuidContainers.length < 1;
  }
  public getSelectedContainers(): string[] {
    return this.selectedUuidContainers;
  }
  public getFirstSelected(): Container {
    return this.getContainerFromUuid(this.selectedUuidContainers[0]);
  }

  /** Map object in Scene */
  addContainerToMapScene(c: Container) {
    this.uuidToContainer.set(c.uuid, c);
  }

  addPlugGeometryToMapScene(c: Container) {
    this.plugGeometryToContainer.set(c.getPlugGeometry(), c);
    this.uuidToBBox.set(
      c.uuid,
      c.getPlugGeometry().getBoundingInfo().boundingBox
    );
  }

  addCameraToMapScene(c: Container, camera: ArcRotateCamera) {
    this.uuidToCamera.set(c.uuid, camera);
  }

  updateSidebarData(containerUUID: string) {
    this.store.dispatch(oneSelection({ uuid: containerUUID }));
  }

  openExportRenderFromViewport() {
    // https://betterprogramming.pub/convert-a-base64-url-to-image-file-in-angular-4-5796a19fdc21
    // https://github.com/BabylonJS/Babylon.js/blob/master/src/Misc/tools.ts
    // https://github.com/BabylonJS/Babylon.js/blob/master/src/Misc/screenshotTools.ts

    /** Clear background to get alpha channel */
    this.engineServ.setBackgroundColorScene('#000000', 0);
    this.engineServ.getGrid().ground.setEnabled(false);
    this.engineServ.getGizmoHelper().setEnabled(false);
    this.engineServ.getEngine().setSize(1920, 1080);

    setTimeout(() => {
    ScreenshotTools.CreateScreenshot(
      this.engineServ.getEngine(),
      this.engineServ.getCamera(),
      { width: 1920, height: 1080 },
      (data) => {
      /*
        data = data.replace('data:image/png;base64,', '');
        const byteCharacters = atob(data);
        const blob = new Blob([...byteCharacters], { type: 'image/png' });
        console.log([byteCharacters]);
        FileSaver.saveAs(blob, 'screenshot.png');
        // Tools.EncodeScreenshotCanvasData(undefined,undefined, 'screenshot.png');
        // this.engineServ.setBackgroundColorScene(this.sceneSettings.backgroundColor, 0);
        var url = URL.createObjectURL(blob)
        var newWindow = window.open("");
        if (!newWindow) { return; }
        var img = newWindow.document.createElement("img");
        img.src = url;
        newWindow.document.body.appendChild(img);
        */

        /** Encode file to Unicode */
        data = data.replace('data:image/png;base64,', '');
        let byteCharacters = atob(data),

        len = byteCharacters.length,
        arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
            arr[i] = byteCharacters.charCodeAt(i);
        }
        
        let blob = new Blob([arr])
        FileSaver.saveAs(blob, 'screenshot.png');
        this.engineServ.setBackgroundColorScene(this.sceneSettings.backgroundColor, 1);
        this.engineServ.getGrid().ground.setEnabled(true);
        this.engineServ.getGizmoHelper().setEnabled(true);
        this.engineServ.getEngine().setSize(1445, 813);
      }

    );},200);

    
  }
}
