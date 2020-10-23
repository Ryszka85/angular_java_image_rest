import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Store} from "@ngxs/store";
import {AuthenticationActions} from "../app-state/actions/authentication-action";
import {GoogleUserLogin, UserLoginModel} from "../domain/userModel/UserLoginModel";
import {MatDialogRef} from "@angular/material/dialog";
import {UserAuthenticationService} from "../service/user-authentication.service";
import {Navigate} from "@ngxs/router-plugin";
import {Location} from "@angular/common";
import LoggedUserDetails = AuthenticationActions.LoggedUserDetails;
import {log} from "util";
import {GoogleLoginProvider, SocialAuthService} from "angularx-social-login";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formGroup;
  public emailFormField = new FormControl('');
  public passwordFormField = new FormControl('');

  constructor(private formBuilder: FormBuilder,
              private store: Store,
              private dialogRef: MatDialogRef<LoginComponent>,
              private authService: UserAuthenticationService,
              private location: Location,
              private googleAuthService: SocialAuthService) {

    this.formGroup = this.formBuilder.group({
      email: this.emailFormField,
      password: this.passwordFormField
    })
  }

  ngOnInit(): void {
  }

  public login(): void {
    const email = this.formGroup.get('email').value
    const password = this.formGroup.get('password').value;
    this.store
      .dispatch(
        new AuthenticationActions.LoginAction(
          new UserLoginModel(
            email,
            password
          )
        )).subscribe(value =>
      this.authService.isLoggedIn()
        .subscribe(value1 => {
          console.log(value1);
          this.store.dispatch(new LoggedUserDetails(value1.body.userId));
        }));
    this.close()
  }

  googleLogin(): void {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(value => {
        this.store.dispatch(new AuthenticationActions.LoginAction(
          new GoogleUserLogin(value.email,
            value.firstName, value.lastName,
            value.photoUrl, value.idToken)
        )).subscribe(value1 => {
          this.store.dispatch(new AuthenticationActions.IsLoggedIn())
            .subscribe(value2 =>
              this.store.dispatch(
                new LoggedUserDetails(value2.Authentication.user.userId))
            )

        });
      });
    this.close();
  }

  public close(): void {
    // this.store.dispatch(new Navigate(['welcome']))
    this.dialogRef.close();
  }

}
