import {TagModel} from "../tagModel/tag-model";
import {BaseUserDetails} from "../userModel/user-details.model";

export interface ImageModel {
  imageId: string;
  link: string;
  name: string;
  profileImg?: string;
  linkReference?: string;
  isPublic?: boolean;
  tags: TagModel[];
  user?: BaseUserDetails;
  downloaded?: number;
  liked?: number;
}

export interface ImageViewModel {
  imageModel: ImageModel;
  owner: boolean;
}


export class SelectedImage{
  image: ImageModel;
}

export class SetImageWithTags {
  userId: string;
  imageId: string;
  tags: TagModel[];
}
