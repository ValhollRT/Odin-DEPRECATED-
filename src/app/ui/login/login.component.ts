import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupDialogAction } from 'src/app/models/actions/PopupDialogAction';
import { SignInUp } from 'src/app/models/SignInUp';
import { openLogin } from '../../store/actions';
import { AppState } from '../../store/reducers/app.reducer';
import { AlertType } from './../../models/AlertType';
import { AppService, LogService, SessionService } from './../../services/index.service';

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
    private store: Store<AppState>,
    public session: SessionService,
    public logService: LogService,
    public appService: AppService) {
    this.signInUp = new SignInUp();
  }

  ngOnInit() {
    this.store.select('ui').subscribe(ui => {
      this.isOpen = ui.login.open;
    });
  }

  closeDialog() {
    this.store.dispatch(openLogin({ login: new PopupDialogAction(false) }))
  }

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