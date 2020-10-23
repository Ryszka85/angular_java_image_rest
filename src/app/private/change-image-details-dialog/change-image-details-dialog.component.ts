import {Component, Inject, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {ImageRequestService} from "../../shared/service/image-request.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageModel} from "../../shared/domain/imageModel/image.model";
import {MatRadioChange} from "@angular/material/radio";
import {FormBuilder, FormControl} from "@angular/forms";
import {SelectImageState} from "../../shared/app-state/states/select-image.state";
import {SelectImage} from "../../shared/app-state/actions/image.action";
import {FocusMonitor} from "@angular/cdk/a11y";
import {Subject} from "rxjs";
import {UpdateImageDetailsService} from "../../serviceV2/update-image-details.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-image-details-dialog',
  templateUrl: './change-image-details-dialog.component.html',
  styleUrls: ['./change-image-details-dialog.component.scss']
})
export class ChangeImageDetailsDialogComponent implements OnInit {
  urlReference = new FormControl('');
  isPublic = new FormControl(false);
  @Select(SelectImageState.getSelectedImage) $selectedImage;
  @Select(SelectImageState.getIsPublic) $isPublic;
  public formGroup;
  public selectedImage: ImageModel;
  public $detailsChanged = new Subject<boolean>();
  public tempPublic: boolean;


  constructor(private store: Store,
              private imageService: ImageRequestService,
              @Inject(MAT_DIALOG_DATA) public data: ImageModel,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<ChangeImageDetailsDialogComponent>,
              private updateImgService: UpdateImageDetailsService) {
  }

  ngOnInit(): void {
    this.selectedImage = this.store.selectSnapshot(SelectImageState.getSelectedImage);
    this.urlReference = new FormControl(this.selectedImage.linkReference);
    this.$selectedImage.subscribe(val => console.log(val.public))
    this.isPublic = new FormControl(this.selectedImage.isPublic);
    this.formGroup = this.formBuilder
      .group({urlReference: this.urlReference})
    // this.urlReference.registerOnChange(foo => this.$detailsChanged.next(true));
    // this.isPublic.registerOnChange(foo => this.$detailsChanged.next(true));
  }

  public urlReferenceValidator(): void {
    const value = this.formGroup.get('urlReference').value;
    console.log(value);
    const regExp = new RegExp("[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(.*)[.]{1}[a-zA-Z]{2,}");
    if (regExp.test(value) || value.length === 0) {
      this.$detailsChanged.next(this.selectedImage.linkReference !== value)
      this.formGroup.controls['urlReference']
        .setErrors(null)
    } else {
      this.formGroup.controls['urlReference']
        .setErrors({'error': true})
    }
  }

  public changeStuff(mrChange: MatRadioChange): void {
    console.log(this.store.selectSnapshot(SelectImageState.getSelectedImage).isPublic);
    console.log(this.selectedImage.isPublic);
    if ((mrChange.value === '1') !==
      this.store.selectSnapshot(SelectImageState.getSelectedImage).isPublic) {
      this.tempPublic = mrChange.value === '1';
      this.$detailsChanged.next(true);
    } else this.$detailsChanged.next(false);
    // this.isPublic = mrChange.value === '1';
  }

  changeDetails(img: ImageModel): void {
    console.log(this.selectedImage);
  }

  saveChanges(): void {
    this.selectedImage.isPublic = this.tempPublic;
    this.selectedImage.linkReference =
      this.urlReference.value.length == 0 ? null : this.urlReference.value;
    this.updateImgService
      .setUserProfile(this.selectedImage)
      .subscribe(value => {
        if (value.status === 200) {
          this.snackBar.open(
            "Image details update was successful.",
            "Details updated",
            {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top"
            }
          );
          this.$detailsChanged.next(false);
        }
      })

    console.log(this.selectedImage)
  }
}
