import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {ImagesByTagState} from "../app-state/states/images-by-tag-state";
import {Observable} from "rxjs";
import {ImageModelList} from "../domain/imageModel/image-model-list";
import {ImageRequestService} from "../service/image-request.service";
import {ImageModel} from "../domain/imageModel/image.model";
import {DisplayImagesAction} from "../app-state/actions/display-images.action";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @Select(ImagesByTagState.getData) $imagesByTags: Observable<ImageModel[]>;
  constructor(private store: Store, private service: ImageRequestService) { }

  ngOnInit(): void {
    this.$imagesByTags.subscribe(value => {

      console.log(value);
    })
  }

}
