import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {NgxDropzoneChangeEvent} from "ngx-dropzone";
import {Select, Store} from "@ngxs/store";
import {UploadImage} from "../../shared/app-state/actions/image.action";
import {LoginStateModel} from "../../shared/app-state/states/login.state.model";
import {switchMap, tap} from "rxjs/operators";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Navigate} from "@ngxs/router-plugin";
import {Location} from '@angular/common';
import {LoggedInUserModel} from "../../shared/domain/userModel/UserLoginModel";
import {BaseUserDetails} from "../../shared/domain/userModel/user-details.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FILE} from "dns";
import {AuthenticationActions} from "../../shared/app-state/actions/authentication-action";
import LoggedUserDetails = AuthenticationActions.LoggedUserDetails;
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatRadioChange} from "@angular/material/radio";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UploadImageModel} from "../../shared/domain/imageModel/upload-image.model";


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  files: File[] = [];
  foo;
  @Output()
  change: EventEmitter<MatRadioChange>
  public formGroup;
  public isPublic: boolean = true;
  fooControl = new FormControl(false);
  public imageUrlReference = new FormControl('');
  @Select(LoginStateModel.loggedInUser) $loggedUser;
  isValidToUpload: boolean = false;

  constructor(private store: Store,
              private dialogRef: MatDialogRef<FileUploadComponent>,
              private router: Router,
              private location: Location,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public userId: string,
              private formBuilder: FormBuilder,
              private http: HttpClient) {
    this.formGroup = this.formBuilder
      .group({url: this.imageUrlReference})
    this.foo = this.formBuilder
      .group({isPublic: this.fooControl})
  }

  ngOnInit(): void {

  }

  public changeStuff(mrChange: MatRadioChange): void {
    console.log(mrChange.value);
    this.isPublic = mrChange.value === '1';
  }

  public validate(value: string): boolean {
    const regExp = new RegExp("[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(.*)[.]{1}[a-zA-Z]{2,}");
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

  public urlReferenceValidator(): void {
    const value = this.formGroup.get('url').value;
    const regExp = new RegExp("[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(.*)[.]{1}[a-zA-Z]{2,}");
    if (regExp.test(value)) {
      this.formGroup.controls['url']
        .setErrors(null)
    } else {
      this.formGroup.controls['url']
        .setErrors({'error': true})
    }
  }

  onSelect($event: NgxDropzoneChangeEvent): void {
    const typeIndex = $event.addedFiles[0].name.lastIndexOf('.');
    const type = $event.addedFiles[0].name.substr(typeIndex + 1);
    if (type === 'jpg' || type === 'png') {
      this.files.push(...$event.addedFiles);
      this.isValidToUpload = true;
    } else {
      this.onRemove($event.addedFiles[0]);
      this.isValidToUpload = false;
      console.log(this.isValidToUpload)
      this.snackBar.open(
        "Unsupported media.",
        "File deleted",
        {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "top"
        }
      );
    }

  }

  onRemove(f: any): void {
    this.files.splice(this.files.indexOf(f), 1);
    this.isValidToUpload = false;
  }

  upload(): void {
    const loggedInUserModel: BaseUserDetails =
      this.store.selectSnapshot(LoginStateModel.loggedInUser);
    let request = new FormData();
    request.append('file', this.files[0]);
    const isP = this.isPublic ? 'true' : 'false';
    const uploadModel: UploadImageModel = {
      userId: loggedInUserModel.userId,
      orgFile: this.files[0],
      isPublic: isP,
      urlReference: this.validate(this.imageUrlReference.value) === true ?
        this.imageUrlReference.value : null,
      file: request
    }

    this.store.dispatch(new UploadImage(uploadModel))
      .subscribe(value1 => {
        request = null;
        this.files = [];
        this.isValidToUpload = false;
        if (value1.Upload.status) {
          this.snackBar.open(
            "File uploaded successfully",
            "File uploaded",
            {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top"
            }
          );
        }
        // window.location.reload();
      });
  }

  close(): void {
    const userId: string = this.store.selectSnapshot(LoginStateModel.loggedUserId);
    // this.router.navigate(['profile'])
    this.store.dispatch(new Navigate(['profile', {userId: userId}]))
    this.dialogRef.close();
  }
}
