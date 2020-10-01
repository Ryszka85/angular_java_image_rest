import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoginComponent} from "../../shared/login/login.component";
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {Location} from "@angular/common";

@Component({
  selector: 'app-file-upload-wrapper',
  templateUrl: './file-upload-wrapper.component.html',
  styleUrls: ['./file-upload-wrapper.component.scss']
})
export class FileUploadWrapperComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    const ref = new MatDialogConfig();
    this.dialog.open(FileUploadComponent,
      {
        width: '1300px',
        height: '450px',
        // disableClose: true,
        autoFocus: false
      });
  }
}
