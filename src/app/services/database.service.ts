import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Store } from '@ngrx/store';
import { Color3 } from 'babylonjs';
import { SceneSettings, User } from '../models';
import { AudioDto } from '../models/AudioDto.model';
import { FontDto } from '../models/FontDto.model';
import { ImageDto } from '../models/ImageDto.model';
import { AppState } from '../store/app.reducer';
import { NewMaterial } from '../ui/create-new-material/create-new-material.component';

export class Directory {
  constructor(public name: string, public parent: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private readonly SCHEMAS = 'schemas';
  private DB = 'valhollrtdemo';
  private readonly DIR = 'directories';
  private readonly SETTINGS = 'settings';
  private readonly USERS = 'users';
  private readonly MATERIAL = 'materials';
  private readonly FONTS = 'fonts';
  private readonly AUDIOS = 'audios';
  private readonly IMAGES = 'images';
  private readonly SCENE = 'scenes';
  private folderId = undefined;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private store: Store<AppState>
  ) {
    this.store.select('ui').subscribe((ui) => {
      this.folderId = ui.folderExplorerId;
    });
  }

  db(collection) {
    return this.firestore
      .collection(this.SCHEMAS)
      .doc(this.DB)
      .collection(collection);
  }

  addNewUser(newUser: User) {
    return this.db(this.USERS).add({
      ...newUser,
      date: new Date(),
    });
  }

  getUserDocId(userId) {
    return this.db(this.USERS).ref.where('uid', '==', userId).limit(1).get();
  }

  getDirectories() {
    return this.db(this.DIR).get();
  }

  createFolder(parentIdDirectory: string) {
    return this.db(this.DIR).add({
      ...new Directory('folder', parentIdDirectory),
    });
  }

  deleteFolder(id: string) {
    return this.db(this.DIR).doc(id).delete();
  }

  setNewParentFolder(firebaseId: string, dir: Directory) {
    return this.db(this.DIR)
      .doc(firebaseId)
      .set({ ...dir });
  }

  renameFolder(firebaseId: string, dir: Directory) {
    return this.db(this.DIR)
      .doc(firebaseId)
      .set({ ...dir });
  }

  getSceneSettings(userId: string): Promise<QuerySnapshot<DocumentData>> {
    return this.db(this.SETTINGS)
      .ref.where('userId', '==', userId)
      .limit(1)
      .get();
  }

  setSceneSettings(settings: SceneSettings): void {
    if (!!settings.userId) {
      this.getSceneSettings(settings.userId).then((s) => {
        if (s.docs.length == 0) this.db(this.SETTINGS).add({ ...settings });
        else if (s.docs.length == 1)
          this.db(this.SETTINGS)
            .doc(s.docs[0].id)
            .set({ ...settings });
      });
    }
  }

  saveNewMaterial(newMaterial: NewMaterial) {
    let diffuseColorRGB = Color3.FromHexString(newMaterial.diffuseColor);

    return this.db(this.MATERIAL).add({
      name: newMaterial.name,
      diffuseColor: {
        r: diffuseColorRGB.r,
        g: diffuseColorRGB.g,
        b: diffuseColorRGB.b,
      },
      specularColor: { r: 0, g: 0, b: 0 },
      ambientColor: { r: 0, g: 0, b: 0 },
      date: new Date(),
      folderId: this.folderId,
    });
  }

  getMaterialsFromFolderId(folderId: string) {
    return this.db(this.MATERIAL).ref.where('folderId', '==', folderId).get();
  }

  getImagesFromFolderId(folderId: string) {
    return this.db(this.IMAGES).ref.where('folderId', '==', folderId).get();
  }

  getAudiosFromFolderId(folderId: string) {
    return this.db(this.AUDIOS).ref.where('folderId', '==', folderId).get();
  }

  getFontsFromFolderId(folderId: string) {
    return this.db(this.FONTS).ref.where('folderId', '==', folderId).get();
  }

  // IMAGES
  public uploadImageToStorage(filename: string, data: any) {
    return this.storage.upload('/images/' + filename, data);
  }

  public getImagesFromStorage() {
    return this.storage.ref('/images/').listAll();
  }

  public refImageCloudStorage(filename: string) {
    return this.storage.ref('/images/' + filename);
  }

  public addImageToDatabase(imageDto: ImageDto): any {
    return this.db(this.IMAGES).add({ ...imageDto });
  }

  // Audios
  public uploadAudioToStorage(filename: string, data: any) {
    return this.storage.upload('/audios/' + filename, data);
  }

  public getAudiosFromStorage() {
    return this.storage.ref('/audios/').listAll();
  }

  public refAudioCloudStorage(filename: string) {
    return this.storage.ref('/audios/' + filename);
  }

  public addAudioToDatabase(audioDto: AudioDto): any {
    return this.db(this.AUDIOS).add({ ...audioDto });
  }

  //Fonts
  public addFontToDatabase(fontDto: FontDto): any {
    return this.db(this.FONTS).add({ ...fontDto });
  }

  public uploadFontToStorage(filename: string, data: any) {
    return this.storage.upload('/fonts/' + filename, data);
  }

  public getFontsFromStorage() {
    return this.storage.ref('/fonts/').listAll();
  }

  public refFontCloudStorage(filename: string) {
    return this.storage.ref('/fonts/' + filename);
  }

  //Alias
}
