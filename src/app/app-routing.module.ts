import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignupComponent} from "./shared/signup/signup.component";
import {ProfileComponent} from "./private/profile/profile.component";
import {WelcomeComponent} from "./shared/welcome/welcome.component";
import {AuthSecurityGuard} from "./security/auth-security.guard";
import {LoginDialogWrapperComponent} from "./shared/dialog-wrapper/login-dialog-wrapper.component";
import {FileUploadComponent} from "./private/file-upload/file-upload.component";
import {FileUploadWrapperComponent} from "./private/file-upload-wrapper/file-upload-wrapper.component";
import {UserGalleryComponent} from "./shared/user-gallery/user-gallery.component";
import {EditProfileComponent} from "./private/edit-profile/edit-profile.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginDialogWrapperComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'upload',
    component: FileUploadWrapperComponent,
    canActivate: [AuthSecurityGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'gallery',
    component: UserGalleryComponent
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [AuthSecurityGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
