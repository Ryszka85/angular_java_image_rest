import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {LoginStateModel} from "../../shared/app-state/states/login.state.model";
import {UserDetailsState} from "../../shared/app-state/states/User-details.state";
import {UserDetailsActions} from "../../shared/app-state/actions/user-details.action";
import {ImagesByUserIDAction} from "../../shared/app-state/actions/image.action";
import {ImagesByUserIdState} from "../../shared/app-state/states/images-by-user-id.state";
import {DisplayImagesAction} from "../../shared/app-state/actions/display-images.action";
import {AuthenticationActions} from "../../shared/app-state/actions/authentication-action";
import {ImageRequestService} from "../../shared/service/image-request.service";
import {LoggedUserDetailsState} from "../../shared/app-state/states/logged-user-details.state";
import {map, share, switchMap, tap} from "rxjs/operators";
import {LoggedInUserModel} from "../../shared/domain/userModel/UserLoginModel";
import {BaseUserDetails} from "../../shared/domain/userModel/user-details.model";
import {UserAuthStateModel} from "../../shared/domain/UserAuthStateModel";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject, Subject} from "rxjs";
import {ImageModel} from "../../shared/domain/imageModel/image.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Select(UserDetailsState.profileImgPath) $profileImg;

  @Select(LoginStateModel.loggedInUser) $logged;
  @Select(UserDetailsState.getUserImages) $userImages;
  @Select(UserDetailsState.getUserLikes) $userLikes;
  @Select(UserDetailsState.userDetails) $userDetails;
  downloadLink: any;
  editableProfile = new BehaviorSubject<boolean>(false);

  constructor(private store: Store,
              private route: ActivatedRoute,
              private service: ImageRequestService) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(param => {
        const userId = param.get('userId');
        this.store.dispatch(new UserDetailsActions.GetUserDetails(userId));
        this.$logged.subscribe(loggedUser => {
          if (loggedUser) {
            console.log(loggedUser)
            this.editableProfile.next(loggedUser.userId === param.get('userId'));
          }
        })
      })

    this.editableProfile.subscribe(value => console.log(value))




    const loggedUser : BaseUserDetails =
      this.store.selectSnapshot(LoginStateModel.loggedInUser);
    if (loggedUser !== undefined && loggedUser !== null) {

      // this.store.dispatch([
      //     new AuthenticationActions.IsLoggedIn(),
      //     new ImagesByUserIDAction(loggedUser.userId)
      //   ]
      // )
    }

  }

  download(name: any, userId: any) {

  }

  ngOnDestroy(): void {

  }
}
