import {Component, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {LoginStateModel} from "../../shared/app-state/states/login.state.model";
import {connectableObservableDescriptor} from "rxjs/internal/observable/ConnectableObservable";
import {UserDetailsState} from "../../shared/app-state/states/User-details.state";
import {UserDetailsActions} from "../../shared/app-state/actions/user-details.action";
import {AuthenticationActions} from "../../shared/app-state/actions/authentication-action";
import {share} from "rxjs/operators";
import {Navigate} from "@ngxs/router-plugin";
import {LoggedInUserModel} from "../../shared/domain/userModel/UserLoginModel";
import {ImagesByUserIDAction} from "../../shared/app-state/actions/image.action";
import {UserAuthenticationService} from "../../shared/service/user-authentication.service";
import {LoggedUserDetailsState} from "../../shared/app-state/states/logged-user-details.state";
import {Form, FormBuilder, FormControl} from "@angular/forms";
import {BaseUserDetails} from "../../shared/domain/userModel/user-details.model";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @Select(UserDetailsState.userDetails) $userDetails;
  @Select(LoginStateModel.profileImg) $profile;
  @Select(LoginStateModel.loggedUserId) $userId;
  firstNameControl = new FormControl();
  lastNameControl = new FormControl();
  emailControl = new FormControl();
  userNameControl = new FormControl();
  formGroup;

  constructor(private store: Store,
              private service: UserAuthenticationService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const loggedUser : BaseUserDetails =
      this.store.selectSnapshot(LoginStateModel.loggedInUser);

     const userDetails: BaseUserDetails =
       this.store.selectSnapshot(LoginStateModel.loggedInUser);

    if (userDetails.userId === undefined) {
      this.store.dispatch(
        new AuthenticationActions.LoggedUserDetails(loggedUser.userId))
        .subscribe(userDetailsResp => {
          this.initFormGroup(userDetailsResp);
        })
    } else {
      this.firstNameControl = new FormControl(userDetails.firstName);
      this.lastNameControl = new FormControl(userDetails.lastName);
      this.emailControl = new FormControl(userDetails.email);
      this.userNameControl = new FormControl(userDetails.username);
      this.formGroup = this.formBuilder.group({
        firstName: this.firstNameControl,
        lastName: this.lastNameControl,
        email: this.emailControl,
        userName: this.userNameControl
      })
    }




    this.firstNameControl.valueChanges.subscribe(value => console.log(value))

    // this.formGroup = this.formBuilder.group({
    //   firstName: null
    // })
    // if (loggedUser !== undefined && loggedUser !== null) {
    //   this.store.dispatch(
    //     new UserDetailsActions
    //       .GetUserDetails(loggedUser.userId)
    //   )
    // } else this.store.dispatch(new Navigate(['/login']))



  }

  private initFormGroup(userDetailsResp) {
    console.log(userDetailsResp.LoggedDetails);
    this.firstNameControl = new FormControl(userDetailsResp.LoggedDetails.firstName);
    this.lastNameControl = new FormControl(userDetailsResp.LoggedDetails.lastName);
    this.emailControl = new FormControl(userDetailsResp.LoggedDetails.email);
    this.userNameControl = new FormControl(userDetailsResp.LoggedDetails.userName);
    this.formGroup = this.formBuilder.group({
      firstName: this.firstNameControl,
      lastName: this.lastNameControl,
      email: this.emailControl,
      userName: this.userNameControl
    })
  }

  navigateToUpload() {
    this.store.dispatch(new Navigate(['upload']))
  }

  handleFileInput(files: FileList) {
    const loggedUser : BaseUserDetails =
      this.store.selectSnapshot(LoginStateModel.loggedInUser);
    let formData = new FormData();
    formData.append("file", files[0])
    this.store.dispatch(new UserDetailsActions
      .UploadUserProfile(loggedUser.userId, formData))
  }
}
