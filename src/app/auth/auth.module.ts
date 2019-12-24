import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// Import the Login component
import { LoginComponent } from "./login/login.component";

// Import the Signup component
import { SignupComponent } from "./signup/signup.component";

// Angular Material Module
import { AngularMaterialModule } from "../angular-material.module";

// Auth Routing Module
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutingModule]
})
export class AuthModule {}
