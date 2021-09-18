import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ArcRotateCamera, BoundingBox, Light, Vector3 } from 'babylonjs';
import { PlugGeometry } from 'src/app/engine/plugs/plug-geometry';
import { PlugSpotLight } from 'src/app/engine/plugs/plug-light/plug-spot-light';
import { EngineService } from 'src/app/services/engine.service';
import { Container } from 'src/app/shared/container/container';
import { LIGHT } from '../configuration/app-constants';
import { PlugCamera } from '../engine/plugs/plug-camera';
import { PlugPointLight } from '../engine/plugs/plug-light/plug-point-light';
import { PlugMaterial } from '../engine/plugs/plug-material';
import { PlugTexture } from '../engine/plugs/plug-texture';
import { PlugTransform } from '../engine/plugs/plug-transform';
import { Utils } from '../engine/Utils/Utils';
import { ImageDto } from '../models/ImageDto.model';
import { MaterialDto } from '../models/MaterialDto.model';
import { SceneSettings } from '../models/SceneSettings.model';
import { setSettings } from '../store/actions/engine.actions';
import { AppState } from '../store/app.reducer';
import { PlugDirectionalLight } from './../engine/plugs/plug-light/plug-directional-light';
import { PlugHemisphericLight } from './../engine/plugs/plug-light/plug-hemispheric-light';
import { PlugText } from './../engine/plugs/plug-text';
import { DatabaseService } from './database.service';

@Injectable({ providedIn: 'root' })
export class AppService {
  public sceneSettings = {
    backgroundColor: '#333335',
    userId: undefined,
  } as SceneSettings;

  // References Containers
  public plugToContainer = new Map<Node | PlugGeometry | Light, Container>();
  public uuidToContainer = new Map<string, Container>();
  public uuidToBBox = new Map<string, BoundingBox>();
  public uuidToCamera = new Map<string, ArcRotateCamera>();
  public userId: string;

  private selectedUuidContainers: string[];

  constructor(
    public engineServ: EngineService,
    public databaseServ: DatabaseService,
    public store: Store<AppState>,
    private sanitizer: DomSanitizer,
    private firestore: AngularFirestore
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
    container.setPlugLight(new PlugDirectionalLight(container));
    container.name = 'Light';

    let x = Utils.degreeToRadians(-15);
    let y = Utils.degreeToRadians(-30);
    let z = Utils.degreeToRadians(-30);
    container.getPlugTransform().rotation = new Vector3(
      Utils.precision(x, 3),
      Utils.precision(y, 3),
      Utils.precision(z, 3)
    );

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
  }

  addPlugTextureFromDto(image: ImageDto) {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    container.setPlugTexture(PlugTexture.fromDto(image.url, container));
  }

  _addPlugTextureFromDto(image: ImageDto) {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();

    this.getImage(image.url)
      .then((blob) => {
        console.log(blob);
        const imageObjectURL = URL.createObjectURL(blob);
        const safeblobUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(imageObjectURL);
        console.log(safeblobUrl);
        // PlugTexture.fromDto(image, container);
      })
      .catch((error) => {
        console.log();
      });
  }

  __addPlugTextureFromDto(image: ImageDto) {
    this.databaseServ
      .refImageCloudStorage('c22ffb29-9d82-ef20-2b23-b8eb50534bc2.png')
      .getDownloadURL()
      .toPromise()
      .then(function (url) {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function (event) {
          var blob = xhr.response;
          console.log(blob);
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch(function (error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  }

  async getImage(url = '') {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        'Content-Type': 'image/png',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.blob(); // parses JSON response into native JavaScript objects
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

  async addPlugText() {
    if (this.noSelected()) return;
    let container = this.getFirstSelected();
    container.setPlugGeometry(new PlugText(container));
    container.name = 'Text';
    this.addPlugGeometryToMapScene(container);
  }

  /** References Containers */
  public getContainerFromUuid(uuid: string): Container {
    return this.uuidToContainer.get(uuid);
  }
  public getContainerFromPlugGeometry(type: Node | PlugGeometry): Container {
    return this.plugToContainer.get(type);
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
    this.plugToContainer.set(c.getPlugGeometry(), c);
    this.uuidToBBox.set(
      c.uuid,
      c.getPlugGeometry().getBoundingInfo().boundingBox
    );
  }

  addCameraToMapScene(c: Container, camera: ArcRotateCamera) {
    this.uuidToCamera.set(c.uuid, camera);
  }
}
