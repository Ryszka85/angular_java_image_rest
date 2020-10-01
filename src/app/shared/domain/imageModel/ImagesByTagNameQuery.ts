import {ImageModel} from "./image.model";

export interface ImagesByTagName {
  page?: number;
  searchTerm: string;
  imagResponseList?: ImageModel[];
}


export class ImagesByTagNameQueryImpl implements ImagesByTagName{
  searchTerm: string;

  constructor(searchTerm: string) {
    this.searchTerm = searchTerm;
  }
}

export class ImagesByTagNameStateModel implements ImagesByTagName{
  page: number;
  searchTerm: string;
  imagResponseList?: ImageModel[];

  constructor(page: number,
              searchTerm: string,
              imagResponseList: ImageModel[]) {
    this.page = page;
    this.searchTerm = searchTerm;
    this.imagResponseList = imagResponseList;
  }
}
