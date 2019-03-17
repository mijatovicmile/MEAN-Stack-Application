import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// Import the Post Service 
import { PostService } from '../posts.service';

// Import Post model where I defined how the Post will looks like
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;

  /**
   * Add PostService as dependency injection
   * 
   * The public keyword automatically create a new property in the component 
   * and store the incoming value in that property
   * 
   * @param postService - Instance of Post Service
   */
  constructor(public postService: PostService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive. 
   */
  ngOnInit() {
    // Fetch a list of posts
    this.posts = this.postService.getPosts();
    
    // Set up a listener by reaching out to the Post Service (getPostUpdateListener), which returns an observable 
    this.postsSub = this.postService.getPostUpdateListener()
      // Pass an argument as a function which will be called whenever a new value was received 
      .subscribe((posts: Post[]) => {
        this.posts = posts;
    });
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. 
   */
  ngOnDestroy() {
    // Remove the subscription and prevent memory leaks
    this.postsSub.unsubscribe();
  }
}
