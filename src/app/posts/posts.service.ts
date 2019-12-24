import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

/**
 * A Subject is a special type of Observable which shares a single execution path among observers (EventEmitter)
 * Use an Observable like an EventEmitter where you in code control when a new value is emitted
 */
import { Subject } from "rxjs";

/**
 * Operators are functions that build on the observables foundation to enable sophisticated manipulation of collections.
 * Map method allows us to transform every element of an array info a new element and store them back into a new array
 */
import { map } from "rxjs/operators";

// Import Post model
import { Post } from "./post.model";

// Environemnt variable
import { environment } from "src/environments/environment";

// Backend api
const BACKEND_API = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })

// Export a PostService
export class PostService {
  // Array where I will store a list of posts, and initialy this is an empty array
  private posts: Post[] = [];

  // Create a new instance of Subject (EventEmitter), and here I want to pass a list of posts as a payload
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  // Inject httpClient dependency
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * - Use get request to reach out to my backend and fetch the posts from that route
   * - The Angular http client use Observables (.subscribe) to listen the request it wraps, so if we as subscribers
   *   don't listen to it becase we are not interested for the response, we will not receive the response
   */
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; totalPosts: number }>(
        BACKEND_API + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              // Every element in the array will be converted to an object with post _id instead of id, and it will be put back into a new array
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            totalPosts: postData.totalPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        // Function that will be executed whenever we get a response
        this.posts = transformedPostData.posts;
        // .next() method will be called by the Observable whenever a new value is emitter (whenever we receive a new value)
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.totalPosts
        });
      });
  }

  // Returns an object to which we can listen the post updating
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    /**
     * Not get the posts from our local array of posts,
     * but instead, get it from the server
     */
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_API + id);
  }

  // Method for adding a new post where I expect to get a post id, title and post content as an argument
  addPost(title: string, content: string, image: File) {
    /**
     * Create an empty FormData object
     *
     * The FormData object lets you compile a set of key/value pairs to send using XMLHttpRequest.
     * It is primarily intended for use in sending form data,
     * but can be used independently from forms in order to transmit keyed data
     */
    const postData = new FormData();

    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{ message: string; post: Post }>(BACKEND_API, postData)
      .subscribe(responseData => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: responseData.post.imagePath
        // };

        // // Update my posts array with new post
        // this.posts.push(post);

        // /**
        //  * Push a new emitted value and this value is a copy of my posts after I updated them
        //  * Emitting whenever I add a new posts
        //  */
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  // Update (edit) post
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    // File will be an object , a string will not
    if (typeof image === "object") {
      /**
       * Create an empty FormData object
       *
       * The FormData object lets you compile a set of key/value pairs to send using XMLHttpRequest.
       * It is primarily intended for use in sending form data,
       * but can be used independently from forms in order to transmit keyed data
       *
       * This is an object provided by JavaScript and formData is basically a data format which
       * allows us to combine text values and blob (file values)
       */
      postData = new FormData();

      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_API + id, postData).subscribe(response => {
      // // Clone post array and store it in an updatedPost constant
      // const updatedPosts = [...this.posts];
      // // Search for that old post version by its ID
      // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      // const post: Post = {
      //     id: id,
      //     title: title,
      //     content: content,
      //     imagePath: response.imagePath
      // };
      // // Update (replace) old post with new post
      // updatedPosts[oldPostIndex] = post;
      // this.posts = updatedPosts;
      // // Tell my app about updating the post through the subject and send a copy of my updated posts
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  // Delete post
  deletePost(postId: string) {
    return this.http.delete(BACKEND_API + postId);
    // .subscribe(() => {
    //     /**
    //      * Update the frontend after deleting the post
    //      *
    //      * This function will be executed for every post in the array and if it returns true
    //      * then that element will be kept, and if returns false then that element will not be part
    //      * of the new filtered posts array
    //      *
    //      * My condition here is that post.id is not equal to postId because I want to keep all entries
    //      * where the condition is not equal, and I want to delete the one where it is equal
    //      */
    //     const updatePosts = this.posts.filter(post => post.id !== postId);
    //     this.posts = updatePosts;
    //     this.postsUpdated.next([...this.posts]);
    // });
  }
}
