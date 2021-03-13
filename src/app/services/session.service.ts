import { LogService } from './log.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from "firebase/app"
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/User';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { login, signUp } from './session.action';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private user: Observable<firebase.User | null>;

  constructor(
    private store: Store<AppState>,
    private logService: LogService,
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore) {
    this.user = this.afAuth.authState;
  }

  initAuthListener(): void {
    this.user.subscribe(fUser => {
      this.logService.log("initAuthListener", fUser?.uid, fUser?.email);
      const user = fUser == undefined ? undefined : new User(fUser.uid, fUser.displayName, fUser.email);
      this.store.dispatch(login({ user: user }));
    })
  }

  authenticated(): boolean {
    return this.user != null; // True ó False
  }

  currentUser(): Observable<firebase.User | null> {
    return this.user;
  }

  resetPassword(email): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  verifyEmail(): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      user.sendEmailVerification();
    });
  }

  signOut(): Promise<void> {
    this.store.dispatch(signUp({ user: undefined }));
    return this.afAuth.signOut();
  }

  signUpWithEmail(email: string, pass: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, pass).then(fUser => {
      const newUser = this.firebaseAuthCredentialToUser(fUser);
      this.firestore.doc(`${newUser.uid}/user`).set({ ...newUser });
      this.store.dispatch(signUp({ user: newUser }));
      return fUser;
    });
  }

  signInWithEmail(email: string, pass: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, pass).then(fUser => {
      const newUser = this.firebaseAuthCredentialToUser(fUser);
      this.store.dispatch(signUp({ user: newUser }));
      return fUser;
    });
  }
  firebaseAuthCredentialToUser(fUser: firebase.auth.UserCredential): User {
    return new User(fUser.user.uid, fUser.user.displayName, fUser.user.email);
  }
}
