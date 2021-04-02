import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export class Directory {
  constructor(
    public name: string,
    public parent: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  getDirectories() {
    return this.firestore.collection('databases').get();
  }

  createFolder(parentIdDirectory: string) {
    return this.firestore.collection('databases').add({
      ... new Directory("folder", parentIdDirectory)
    })
  }

  deleteFolder(id: string) {
    return this.firestore.collection('databases').doc(id).delete();
  }

  setNewParentFolder(firebaseId: string, dir: Directory) {
    return this.firestore.collection('databases').doc(firebaseId).set({ ...dir });
  }

  renameFolder(firebaseId: string, dir: Directory) {
    return this.firestore.collection('databases').doc(firebaseId).set({ ...dir });
  }
}