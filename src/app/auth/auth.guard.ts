import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if user is authenticated
    const isAuth = this.authService.getIsAuth();

    // If user is not authenticated
    if (!isAuth) {
      this.router.navigate(["/auth/login"]);
    } else {
      // If user is authenticated
      return isAuth;
    }
  }
}
