import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isOpenAboutUs: BehaviorSubject<boolean>;
  isOpenConsole: BehaviorSubject<boolean>;

  constructor() {
    this.isOpenAboutUs = new BehaviorSubject(false);
    this.isOpenConsole = new BehaviorSubject(false);
  }

  openAboutOdin() {
    this.isOpenAboutUs.next(!this.isOpenAboutUs.getValue());
  }

  openConsole() {
    this.isOpenConsole.next(!this.isOpenConsole.getValue());
  }
}
