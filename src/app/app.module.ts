// Exports required infrastructure for Angular application
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Exports the required providers and directives for template-driven forms, making them available for import by NgModules that import this module.
import { FormsModule }   from '@angular/forms';

// Decorator that marks a class as an NgModule and supplies configuration metadata.
import { NgModule } from '@angular/core';

// Import the app component
import { AppComponent } from './app.component';

// Import the post create component
import { PostCreateComponent } from '../app/posts/post-create/post-create.component';

// Import the post list component
import { PostListComponent } from './posts/post-list/post-list.component';

// Import the header component
import { HeaderComponent } from './header/header.component';

// Import the @angular/material component modules
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule
} from "@angular/material";


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
