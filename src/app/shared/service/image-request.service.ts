import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, EMPTY, Observable, Subject} from "rxjs";
import {ImageModel, SetImageWithTags} from "../domain/imageModel/image.model";
import {TagModel} from "../domain/tagModel/tag-model";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {ResponseBody} from "../domain/responseBody";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImageRequestService {
  // 178.112.217.30
  public $bSubject = new BehaviorSubject<ImageModel[]>(null);
  // private readonly SEARCH_URL: string = "http://localhost:8880/image-app/images/search/by/tag/";
  private readonly SEARCH_URL: string = environment.apiUrl + "library/search-by/tag/";
  public static readonly DOWNLOAD_URL = environment.apiUrl + "library/download/file/";
  public static readonly ALL_IMAGES_BY_USERID = environment.apiUrl + "library/search-by/user/";
  private readonly UPLOAD_PROFILE_IMAGE = environment.apiUrl + "user/set/profile-image/";
  private readonly UPLOAD_TAG = environment.apiUrl + "image/update/tags/";

  constructor(private http: HttpClient) {
  }

  public setTagToImage(data: SetImageWithTags): Observable<any> {
    console.log(data)
    return this.http.post(
      this.UPLOAD_TAG,
      data,
      {observe: 'response'});
  }


  public getImagesByUserId(userId: string): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(
      ImageRequestService.ALL_IMAGES_BY_USERID + userId)
      .pipe(
        tap(x => console.log(x))
      );
  }

  public getImagesByTag(term: string, page: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(
      this.SEARCH_URL + term + "?page=" + page,
      {observe: 'response', responseType: 'json'})
      .pipe(
        map(resp => {
          console.log(resp.status)
          return resp.body;
        }),
        catchError((err) => {
          console.log(err.error.message);
          return EMPTY;
        }));
  }

}
