import {Action, Selector, State, StateContext} from "@ngxs/store";
import {ImageModel} from "../../domain/imageModel/image.model";
import {Injectable} from "@angular/core";
import {TagRequestService} from "../../../serviceV2/tag-request.service";
import {ImagesByTagsAction, ImagesNextPageAction} from "../actions/image.action";
import {map, switchMap, tap} from "rxjs/operators";
import {ImageModelList} from "../../domain/imageModel/image-model-list";
import {BehaviorSubject, Observable} from "rxjs";
import {ImageRequestService} from "../../service/image-request.service";
import {ImagesByTagNameStateModel} from "../../domain/imageModel/ImagesByTagNameQuery";


@State<ImagesByTagNameStateModel>({
  name: 'image',
  defaults: {
    page: 0,
    searchTerm: "",
    imagResponseList: null
  }

})
@Injectable()
export class ImagesByTagState {
  constructor(private imageRequestService: ImageRequestService) {
  }

  @Selector()
  static getData(state: ImagesByTagNameStateModel): ImageModel[] {
    return state.imagResponseList;
  }

  @Action(ImagesByTagsAction)
  searchByTags(ctx: StateContext<ImagesByTagNameStateModel>, action: ImagesByTagsAction): Observable<ImageModel[]> {
    const state = ctx.getState();
    const term = action.imagesByTag.searchTerm;
    let page = state.page;
    page = term !== state.searchTerm ? 0 : page;
    return this.imageRequestService
      .getImagesByTag(term, page).pipe(
        map(res => {
          console.log(res)
          ctx.patchState(
            {
              ...state,
              page: page,
              searchTerm: term,
              imagResponseList: res
            }
          )
          return state.imagResponseList;
        })
      )
  }

  // @Selector()
  // static getImageData(state: ImagesByTagNameQuery): ImageModelList {
  //   return state.imagResponseList;
  // }

  @Action(ImagesNextPageAction)
  getNextPage(ctx: StateContext<ImagesByTagNameStateModel>, action: ImagesNextPageAction) {
    const state = ctx.getState();
    const nextPage = state.page + 1;

    return this.imageRequestService
      .getImagesByTag(state.searchTerm, nextPage)
      .pipe(
        tap(res => {
          console.log(res.length);
          ctx.setState(
            {
              ...state,
              page: nextPage,
              searchTerm: state.searchTerm,
              imagResponseList: res.length === 0 ? state.imagResponseList :
                state.imagResponseList.concat(res)
            }
          )
        })
      )
  }
}
