import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SecureInterceptorService {

  constructor(
      private authService : AuthService, 
      private router: Router,
      private spinner: NgxSpinnerService
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.spinner.show();

    if (this.authService.verifyAuthentication()) {
      request = request.clone({
            setHeaders: {
              'Access-Control-Allow-Origin': '*',
              "Accept": "*/*",
              // 'Content-Type': request.url.includes(this.documentService.formDataRoute) ? 'multipart/form-data' : 'application/json',
              // 'Content-Type': 'multipart/form-data',
              'Authorization' : `Bearer ${this.authService.getToken()}`
            }
        });
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinner.hide();
          }
          return event;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.authService.logOut();
        }
        this.spinner.hide(); 
        return throwError( err );
      })
    );
  }
}
