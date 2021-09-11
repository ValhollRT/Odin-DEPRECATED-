import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { SceneSettings, User } from '../models';

export class Directory {
  constructor(
    public name: string,
    public parent: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public readonly SCHEMAS = 'schemas';
  public DB = 'valhollrtdemo';
  public readonly DIR = 'directories';
  public readonly SETTINGS = 'settings';
  public readonly USERS = 'users';
  public readonly MATERIAL = 'materials';
  public readonly FONTS = 'fonts';
  public readonly AUDIOS = 'audios';
  public readonly IMAGES = 'images';
  public readonly SCENE = 'scenes';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  db(collection) {
    return this.firestore.collection(this.SCHEMAS).doc(this.DB).collection(collection);
  }

  addNewUser(newUser: User) {
    return this.db(this.USERS).add({
      ...newUser,
      date: new Date()
    })
  }

  getUserDocId(userId){
    return this.db(this.USERS).ref.where("uid", "==", userId).limit(1).get();
  }
  
  getDirectories() {
    return this.db(this.DIR).get();
  }

  createFolder(parentIdDirectory: string) {
    return this.db(this.DIR).add({
      ... new Directory("folder", parentIdDirectory)
    })
  }

  deleteFolder(id: string) {
    return this.db(this.DIR).doc(id).delete();
  }

  setNewParentFolder(firebaseId: string, dir: Directory) {
    return this.db(this.DIR).doc(firebaseId).set({ ...dir });
  }

  renameFolder(firebaseId: string, dir: Directory) {
    return this.db(this.DIR).doc(firebaseId).set({ ...dir });
  }

  getSceneSettings(userId: string): Promise<QuerySnapshot<DocumentData>> {
    return this.db(this.SETTINGS).ref.where("userId", "==", userId).limit(1).get();
  }

  setSceneSettings(settings: SceneSettings): void {
    if (!!settings.userId) {
      this.getSceneSettings(settings.userId).then( s => {
        if (s.docs.length == 0) this.db(this.SETTINGS).add({ ...settings });
        else if (s.docs.length == 1) this.db(this.SETTINGS).doc(s.docs[0].id).set({ ...settings });
      });
    }
  }


  addNewMaterial(folderId: any) {
    return this.db(this.MATERIAL).add({
      name: "material",
      diffuse: { r: 0, g: 0, b: 0 },
      specular: { r: 0, g: 0, b: 0 },
      ambient: { r: 0, g: 0, b: 0 },
      date: new Date(),
      folderId: folderId
    })
  }

  getFolderContent(id: string) {
    return this.db(this.MATERIAL).ref.where("folderId", "==", id).get();
  }

  //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
}