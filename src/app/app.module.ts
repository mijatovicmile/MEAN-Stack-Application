// Exports required infrastructure for Angular application
import { BrowserModule } from "@angular/platform-browser";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// App routing module
import { AppRoutingModule } from "./app-routing.module";

/**
 * Import Reactive and template driven forms
 * Reactive forms provide a model-driven approach to handling form inputs whose values change over time
 */
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

/**
 * The HttpClient offers a simplified client HTTP API for Angular applications that rests on the
 * XMLHttpRequest interface exposed by browsers.
 */
import { HttpClientModule } from "@angular/common/http";

// Decorator that marks a class as an NgModule and supplies configuration metadata.
import { NgModule } from "@angular/core";

// Import the app component
import { AppComponent } from "./app.component";

// Import the post create component
import { PostCreateComponent } from "../app/posts/post-create/post-create.component";

// Import the post list component
import { PostListComponent } from "./posts/post-list/post-list.component";

// Import the Login component
import { LoginComponent } from "./auth/login/login.component";

// Import the Signup component
import { SignupComponent } from "./auth/signup/signup.component";

// Import the header component
import { HeaderComponent } from "./header/header.component";

// Import the @angular/material component modules
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule
} from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
