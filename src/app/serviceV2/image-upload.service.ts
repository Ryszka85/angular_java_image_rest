import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly UPLOAD_IMAGE = environment.apiUrl + "images/insert/";
  constructor(private http: HttpClient) { }

  public addToUserLibrary(userId: string, image: FormData): Observable<any> {
    return this.http.post(
      this.UPLOAD_IMAGE + userId, image,
      {observe: 'response'});
  }
}
