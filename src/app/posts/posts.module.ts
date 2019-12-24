import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// Reactive Forms Module
import { ReactiveFormsModule } from "@angular/forms";
// Router Module
import { RouterModule } from "@angular/router";

// Import the post create component
import { PostCreateComponent } from "./post-create/post-create.component";

// Import the post list component
import { PostListComponent } from "./post-list/post-list.component";

// Angular Material Module
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ]
})
export class PostsModule {}
