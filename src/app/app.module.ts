// Exports required infrastructure for Angular application
import { BrowserModule } from "@angular/platform-browser";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// App routing module
import { AppRoutingModule } from "./app-routing.module";

/**
 * The HttpClient offers a simplified client HTTP API for Angular applications that rests on the
 * XMLHttpRequest interface exposed by browsers.
 */
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// Decorator that marks a class as an NgModule and supplies configuration metadata.
import { NgModule } from "@angular/core";

// Import the app component
import { AppComponent } from "./app.component";

// Import the header component
import { HeaderComponent } from "./header/header.component";

// Import Interceptors
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";

// Angular material module
import { AngularMaterialModule } from "./angular-material.module";

// Posts Module
import { PostsModule } from "./posts/posts.module";

// Error component
import { ErrorComponent } from "./error/error.component";

@NgModule({
  declarations: [AppComponent, HeaderComponent, ErrorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  // Inform Angular that this component is goint to get used, even though Angular can't see it.
  entryComponents: [ErrorComponent]
})
export class AppModule {}
