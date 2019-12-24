import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs/internal/Subscription";

import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
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

  // Signup
  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    if (form.invalid) {
      return;
    }
    this.spinnerIsLoading = true;
    this.authService.signup(email, password);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
