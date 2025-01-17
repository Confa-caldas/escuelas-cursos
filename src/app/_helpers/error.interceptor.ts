import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError(err => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          // cierre de sesión automático si se devuelve la respuesta 401 de la api
          this.authenticationService.logout();
          location.reload(); //DESCOMENTAR 
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      }))
  }
}
