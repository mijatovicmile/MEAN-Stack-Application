import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  spinnerIsLoading = false;
  private authSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.spinnerIsLoading = false;
      });
  }

  // Login
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.spinnerIsLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    this.authService.login(email, password);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
