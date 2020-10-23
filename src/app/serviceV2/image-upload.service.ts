import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {UploadImageModel} from "../shared/domain/imageModel/upload-image.model";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly UPLOAD_IMAGE = environment.apiUrl + "images/insert/";
  constructor(private http: HttpClient) { }

  public addToUserLibrary(uploadModel: UploadImageModel): Observable<any> {
    let request: FormData = new FormData();
    request.append("file", uploadModel.orgFile);
    request.append("userId", uploadModel.userId);
    request.append("urlReference", uploadModel.urlReference);
    request.append("isPublic", uploadModel.isPublic);
    console.log(uploadModel.urlReference);
    return this.http.post(
      this.UPLOAD_IMAGE, request,
      {observe: 'response'});
  }
}
