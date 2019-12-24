import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

// Import Post model where I defined how the Post will looks like
import { Post } from "../post.model";

// Import the Post Service
import { PostService } from "../posts.service";

// Import Auth Service
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  userId: string;

  // Subscriptions
  private postsSub: Subscription;
  private authSubscription: Subscription;

  // MatSpinner
  spinnerIsLoading = false;

  // Authentication
  userIsAuthenticated = false;

  // MatPaginator Inputs
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 7, 10];

  /**
   * Add PostService as dependency injection
   *
   * The public keyword automatically create a new property in the component
   * and store the incoming value in that property
   *
   * @param postService - Instance of Post Service
   */
  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit() {
    this.spinnerIsLoading = true;

    // Trigger HTTP request whenever the post list component is loaded
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    // Get User ID
    this.userId = this.authService.getUserId();

    // Set up a listener by reaching out to the Post Service (getPostUpdateListener), which returns an observable
    this.postsSub = this.postService
      .getPostUpdateListener()
      // Pass an argument as a function which will be called whenever a new value was received
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.spinnerIsLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.userIsAuthenticated = authStatus;
        this.userId = this.authService.getUserId();
      });
  }

  /**
   * Changing the page with paginator
   * @param pageData - MatPaginator Output
   */
  onChangedPage(pageData: PageEvent) {
    this.spinnerIsLoading = true;

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  // Delete post
  onDelete(postId: string) {
    this.spinnerIsLoading = true;

    this.postService.deletePost(postId).subscribe(
      () => {
        // Fething new posts when once we successfully deleted a post
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      },
      error => {
        this.spinnerIsLoading = false;
      }
    );
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   */
  ngOnDestroy() {
    // Remove the subscription and prevent memory leaks
    this.postsSub.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
