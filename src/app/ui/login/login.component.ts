import { AlertType } from './../../models/AlertType';
import { SessionService } from '../../services/session.service';
import { LogService } from 'src/app/services/log.service';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/index.service';
import { SignInUp } from 'src/app/models/SignInUp';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isOpen = false;
  isLogin = true;
  signInUp: SignInUp;
  message: string = "";
  showAlert: boolean = false;
  typeAlert: AlertType;

  constructor(
    public session: SessionService,
    public logService: LogService,
    public appService: AppService) {
    this.signInUp = new SignInUp();
  }

  ngOnInit() {
    this.appService.isOpenLogin.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }

  closeDialog() { this.appService.isOpenLogin.next(false); }

  signUpWithEmail() {
    this.showAlert = false;
    this.session.signUpWithEmail(this.signInUp.email, this.signInUp.password)
      .then(user => {
        this.message = `The user ${user.user.email} was created successfully.`
        this.typeAlert = AlertType.SUCCESS;
        this.showAlert = true;
      }).catch(err => {
        this.message = `${err}`
        this.typeAlert = AlertType.ERROR;
        this.showAlert = true;
      });
  }

  signInWithEmail() {
    this.session.signInWithEmail(this.signInUp.email, this.signInUp.password)
      .then(user => {
        this.closeDialog();
      }).catch(err => {
        this.message = `${err}`
        this.typeAlert = AlertType.ERROR;
        this.showAlert = true;
      });
  }

}