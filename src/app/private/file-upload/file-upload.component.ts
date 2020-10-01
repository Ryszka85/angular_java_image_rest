import {Component, OnInit} from '@angular/core';
import {NgxDropzoneChangeEvent} from "ngx-dropzone";
import {Select, Store} from "@ngxs/store";
import {UploadImage} from "../../shared/app-state/actions/image.action";
import {LoginStateModel} from "../../shared/app-state/states/login.state.model";
import {switchMap} from "rxjs/operators";
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Navigate} from "@ngxs/router-plugin";
import {Location} from '@angular/common';
import {LoggedInUserModel} from "../../shared/domain/userModel/UserLoginModel";
import {BaseUserDetails} from "../../shared/domain/userModel/user-details.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FILE} from "dns";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  files: File[] = [];
  @Select(LoginStateModel.loggedInUser) $loggedUser;
  isValidToUpload: boolean = false;

  constructor(private store: Store,
              private dialogRef: MatDialogRef<FileUploadComponent>,
              private router: Router,
              private location: Location,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  onSelect($event: NgxDropzoneChangeEvent): void {
    const typeIndex = $event.addedFiles[0].name.lastIndexOf('.');
    const type = $event.addedFiles[0].name.substr(typeIndex + 1);
    if (type === 'jpg' || type === 'png') {
      this.files.push(...$event.addedFiles);
      this.isValidToUpload = true;
    } else {
      this.isValidToUpload = false;
      this.onRemove($event.addedFiles[0]);
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
  }

  upload(): void {
    const loggedInUserModel: BaseUserDetails =
      this.store.selectSnapshot(LoginStateModel.loggedInUser);
    let formData = new FormData();
    formData.append("file", this.files[0]);
    this.store.dispatch(new UploadImage(loggedInUserModel.userId, formData))
      .subscribe(value1 => {
        formData = null;
        this.files = [];
      });
  }

  close(): void {
    const userId: string = this.store.selectSnapshot(LoginStateModel.loggedUserId);
    this.store.dispatch(new Navigate(['profile', {userId: userId}]))
    this.dialogRef.close();
  }
}
