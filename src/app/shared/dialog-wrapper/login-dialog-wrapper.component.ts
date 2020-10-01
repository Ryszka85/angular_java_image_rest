import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignupComponent} from "../signup/signup.component";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-dialog-wrapper',
  templateUrl: './login-dialog-wrapper.component.html',
  styleUrls: ['./login-dialog-wrapper.component.scss']
})
export class LoginDialogWrapperComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    const ref = new MatDialogConfig();
    this.dialog.open(LoginComponent,
      {
        width: '350px',
        disableClose: true,
        autoFocus: false
      });
  }

}
