import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve Auth token from service
    const token = this.authService.getToken();

    const modifiedRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + token)
    });

    return next.handle(modifiedRequest);
  }
}
