import {Action, Selector, State, StateContext} from "@ngxs/store";
import {ImageModel, SelectedImage} from "../../domain/imageModel/image.model";
import {Injectable} from "@angular/core";
import {SelectImage} from "../actions/image.action";




@State<SelectedImage> ( {
  name: 'SelectImage'
} )
@Injectable()
export class SelectImageState {
  constructor() { }

  @Selector()
  static getSelectedImage(state: SelectImage): ImageModel {
    return state.image;
  }

  @Selector()
  static getSelectedImageId(state: SelectImage): string {
    return state.image.imageId;
  }

  @Selector()
  static getSelectedLink(state: ImageModel): string {
    return state.link;
  }
  @Action(SelectImage)
  selectImage(ctx: StateContext<SelectedImage>, action: SelectImage) {
    const state = ctx.getState();
    ctx.setState( {
      ...state,
      image: action.image
    } )
  }

}
