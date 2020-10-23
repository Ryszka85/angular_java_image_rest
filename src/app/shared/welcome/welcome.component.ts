import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {ImagesByTagState} from "../app-state/states/images-by-tag-state";
import {Observable} from "rxjs";
import {ImageModelList} from "../domain/imageModel/image-model-list";
import {ImageRequestService} from "../service/image-request.service";
import {ImageModel} from "../domain/imageModel/image.model";
import {DisplayImagesAction} from "../app-state/actions/display-images.action";
import {environment} from "../../../environments/environment";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  foo: string = "IHUTiYJ6Wdk.jpg";
  @Select(ImagesByTagState.getData) $imagesByTags: Observable<ImageModel[]>;
  constructor(private store: Store, private service: ImageRequestService,
              private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {

    console.log(this.deviceService.isMobile());

    this.$imagesByTags.subscribe(value => {

      console.log(value);
    })
  }

}
