import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {debounceTime, map, switchMap, tap, throttleTime} from "rxjs/operators";
import {TagRequestService} from "../../serviceV2/tag-request.service";
import {connectableObservableDescriptor} from "rxjs/internal/observable/ConnectableObservable";
import {ImageModel} from "../domain/imageModel/image.model";
import {Select, Store} from "@ngxs/store";
import {ImagesByTagsAction} from "../app-state/actions/image.action";
import {ImagesByTagState} from "../app-state/states/images-by-tag-state";
import {ImageModelList} from "../domain/imageModel/image-model-list";
import {QueryTagAction} from "../app-state/actions/query-tag-action";
import {TagModel} from "../domain/tagModel/tag-model";
import {SearchByTagState} from "../app-state/states/search-by-tag.state";
import {TagQueryList} from "../domain/tagModel/tag-query-list";
import {ImageRequestService} from "../service/image-request.service";
import {ImagesByTagNameQueryImpl} from "../domain/imageModel/ImagesByTagNameQuery";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignupComponent} from "../signup/signup.component";
import {LoggedInUserModel} from "../domain/userModel/UserLoginModel";
import {LoginComponent} from "../login/login.component";
import {LoginStateModel} from "../app-state/states/login.state.model";
import {AuthenticationActions} from "../app-state/actions/authentication-action";
import {UserAuthenticationService} from "../service/user-authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Navigate} from "@ngxs/router-plugin";
import {error} from "@angular/compiler/src/util";
import {DisplayImagesAction} from "../app-state/actions/display-images.action";
import {UserDetailsState} from "../app-state/states/User-details.state";
import {UserDetailsActions} from "../app-state/actions/user-details.action";
import {LoggedUserDetailsState} from "../app-state/states/logged-user-details.state";
import {IUserAuthState} from "../domain/UserAuthStateModel";
import {BaseUserDetails} from "../domain/userModel/user-details.model";
import {GoogleLoginProvider, SocialAuthService} from "angularx-social-login";
import LoggedUserDetails = AuthenticationActions.LoggedUserDetails;


@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search.toolbar.component.html',
  styleUrls: ['./search.toolbar.component.scss']
})
export class SearchToolbarComponent implements OnInit, OnDestroy {
  //Search
  // @Input() matAutocomplete: any;
  searchTerm$ = new Subject<string>();
  @Select(SearchByTagState.getFetchedTagList) tags$: Observable<TagModel[]>;
  @Select(LoginStateModel.isLoggedIn) $isLoggedIn;
  @Select(LoggedUserDetailsState.getProfile) $profileImage;
  @Select(LoginStateModel.loggedInUser) $loggedUser;
  @Select(LoggedUserDetailsState.loggedUsername) $userName;

  // ng until destroy

  constructor(private service: TagRequestService,
              public store: Store,
              public imageService: ImageRequestService,
              private dialog: MatDialog,
              private authService: UserAuthenticationService,
              private router: Router,
              private route: ActivatedRoute) {


    this.searchTerm$
      .pipe(debounceTime(1000))
      .subscribe(value => {
        console.log(value)
        this.store.dispatch(new QueryTagAction(new BehaviorSubject(value)))
      });
  }

  foo(evt) {
    console.log(evt.target.value)
  }

  ngOnInit(): void {
    let val: BaseUserDetails =
      this.store.selectSnapshot(LoginStateModel.loggedInUser);
    if (val === undefined || val === null)
      this.store.dispatch(new AuthenticationActions.IsLoggedIn())
        .subscribe(value => {
          this.store.dispatch(new LoggedUserDetails(value.Authentication.user.userId))
            .subscribe(value1 => console.log(value1));
        });
  }

  search(selected: string): void {
    this.store.dispatch(new ImagesByTagsAction(
      new ImagesByTagNameQueryImpl(selected)))
      .subscribe(value => {
        console.log(value);
        console.log("Search pressed..");
        this.store.dispatch(new Navigate(['/welcome']))
      });

  }

  signup(): void {
    const ref = new MatDialogConfig();
    this.dialog.open(SignupComponent,
      {
        width: '660px',
        disableClose: true,
        autoFocus: false
      });
  }

  login(): void {
    const ref = new MatDialogConfig();
    ref.disableClose = true;
    this.dialog.open(LoginComponent, {width: '380px'});
  }

  logout(): void {
    this.store.dispatch(new AuthenticationActions.Logout())
      .subscribe(value =>
        this.store.dispatch(new Navigate(['welcome'])))
  }

  navigateUploadImage(): void {
    let loggedUser: BaseUserDetails =
      this.store.selectSnapshot(LoginStateModel.loggedInUser);
    this.router.navigate(['upload', {userId: loggedUser.userId}]);
  }


  navigateToSettings(): void {
    this.store.dispatch(new Navigate(['edit-profile']))
  }

  navigateToUser(): void {
    let loggedUser: BaseUserDetails =
      this.store.selectSnapshot(LoginStateModel.loggedInUser);
    console.log(loggedUser)
    this.store.dispatch(
      new Navigate(['profile', {userId: loggedUser.userId}])
    )
  }

  ngOnDestroy(): void {
  }
}
