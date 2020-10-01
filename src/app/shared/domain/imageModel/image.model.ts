import {TagModel} from "../tagModel/tag-model";
import {BaseUserDetails} from "../userModel/user-details.model";

export interface ImageModel {
  imageId: string;
  link: string;
  name: string;
  profileImg?: string;
  tags: TagModel[];
  user?: BaseUserDetails;
}


export class SelectedImage{
  image: ImageModel;
}

export class SetImageWithTags {
  userId: string;
  imageId: string;
  tags: TagModel[];
}
