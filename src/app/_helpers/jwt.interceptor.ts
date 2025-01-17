import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { AuthenticationService } from "../services/authentication.service";
import { QuestionsService } from "../services/questions.service";
import { first } from "rxjs/operators";
import { ValidateToken } from "../interfaces/user.interface";
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private questionsService: QuestionsService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    // añadir la cabecera de autorización con el token jwt si está disponible

    let genericToken = this.authenticationService.genericTokenValue;
    let currentToken = this.authenticationService.currentTokenValue;
    let circularToken = this.authenticationService.circularTokenValue;

    if (request.url.includes("circular007")) {
      if (circularToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${circularToken.token}`,
          },
        });
      }
    } else if (request.url.includes("https://script.google.com")) {
    } else {
      if (currentToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentToken.token}`,
          },
        });
      }

      if (genericToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${genericToken.token}`,
          },
        });
      }
    }

    return next.handle(request);
  }
}
