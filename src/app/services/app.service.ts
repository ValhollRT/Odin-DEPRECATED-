import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isOpenAboutUs: BehaviorSubject<boolean>;

  constructor() {
    this.isOpenAboutUs = new BehaviorSubject(false);
  }

  openAboutOdin() {
    this.isOpenAboutUs.next(!this.isOpenAboutUs.getValue());
  }
}