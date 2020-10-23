import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoginComponent} from "../../shared/login/login.component";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {Location} from "@angular/common";
import {Store} from "@ngxs/store";
import {ActivatedRoute} from "@angular/router";
import {AuthenticationActions} from "../../shared/app-state/actions/authentication-action";
import LoggedUserDetails = AuthenticationActions.LoggedUserDetails;

@Component({
  selector: 'app-file-upload-wrapper',
  templateUrl: './file-upload-wrapper.component.html',
  styleUrls: ['./file-upload-wrapper.component.scss']
})
export class FileUploadWrapperComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private store: Store) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(param => {
        const userId = param.get('userId');
        this.store.dispatch(new LoggedUserDetails(userId))
        const ref = new MatDialogConfig();
        this.dialog.open(FileUploadComponent,
          {
            width: '900px',
            height: '650px',
            disableClose: true,
            autoFocus: false,
            data: userId
          });
      });
  }
}
