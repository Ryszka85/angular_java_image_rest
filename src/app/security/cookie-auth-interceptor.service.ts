import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {AuthenticationActions} from "../shared/app-state/actions/authentication-action";
import {catchError} from "rxjs/operators";
import {Navigate} from "@ngxs/router-plugin";
import {ResponseBody} from "../shared/domain/responseBody";

@Injectable({
  providedIn: 'root'
})
export class CookieAuthInterceptorService implements HttpInterceptor{

  constructor(private store: Store) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedReq = req.clone({withCredentials: true});
    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', error.error.message);
        } else {
          // this.store.dispatch(new Navigate(['/login']))
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(error.message);
          console.log(`Backend returned code ${error.status}, body was: ${error.error.message}`);
        }

        // If you want to return a new response:
        //return of(new HttpResponse({body: [{name: "Default value..."}]}));

        // If you want to return the error on the upper level:
        //return throwError(error);

        // or just return nothing:
        return EMPTY;
      })
    );
  }
}
