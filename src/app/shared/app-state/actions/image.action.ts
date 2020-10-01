import {Observable} from "rxjs";
import {ImageModel} from "../../domain/imageModel/image.model";
import {ImagesByTagNameQueryImpl} from "../../domain/imageModel/ImagesByTagNameQuery";

export class ImagesByUserIDAction {
  static readonly type = '[ImageAPI] Images by userId';
  constructor(public userId: string) { }
}

export class ImagesByTagsAction {
  static readonly type = '[ImageAPI] ImagesByTagsAction';
  constructor(public imagesByTag: ImagesByTagNameQueryImpl) { }
}

export class ImagesNextPageAction {
  static readonly type = '[ImageAPI] NextImagePage';
  constructor(public imageResponseModel: ImageModel[]) { }
}

export class UploadImage {
  static readonly type = '[ImageAPI] Upload image';
  constructor(public userId: string, public file: FormData) { }
}

export class SelectImage {
  static readonly type = '[ImageAPI] Select image';
  constructor(public image: ImageModel) { }
}
