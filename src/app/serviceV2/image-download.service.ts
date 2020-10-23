import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ImageModel} from "../shared/domain/imageModel/image.model";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ImageDownloadService {
  constructor(private http: HttpClient) {
  }

  public static readonly DOWNLOAD_URL = environment.apiUrl + "library/download/file/";

  public getImagesByUserId(userId: string, fileName: string): Observable<ImageModel[]> {
    return this.http
      .get<ImageModel[]>(
        ImageDownloadService.DOWNLOAD_URL +
        fileName + "/user/" + userId);
  }

}
