import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

import { AuthService } from "./auth/auth.service";
import { AuthGuard } from "./auth/auth.guard";

const appRoutes: Routes = [
  { path: "", component: PostListComponent },
  { path: "create", canActivate: [AuthGuard], component: PostCreateComponent },
  {
    path: "edit/:postId",
    canActivate: [AuthGuard],
    component: PostCreateComponent
  },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard]
})
export class AppRoutingModule {}
