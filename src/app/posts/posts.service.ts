import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * A Subject is a special type of Observable which shares a single execution path among observers (EventEmitter)
 * Use an Observable like an EventEmitter where you in code control when a new value is emitted
 */
import { Subject } from 'rxjs';

/**
 * Operators are functions that build on the observables foundation to enable sophisticated manipulation of collections. 
 * Map method allows us to transform every element of an array info a new element and store them back into a new array
 */
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// Import Post model 
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })

// Export a PostService 
export class PostService {

    // Array where I will store a list of posts, and initialy this is an empty array
    private posts : Post[] = [];
    
    // Create a new instance of Subject (EventEmitter), and here I want to pass a list of posts as a payload 
    private postsUpdated = new Subject<Post[]>();

    // Inject httpClient dependency
    constructor(private http: HttpClient, private router: Router) {}

    /**
     * - Use get request to reach out to my backend and fetch the posts from that route 
     * - The Angular http client use Observables (.subscribe) to listen the request it wraps, so if we as subscribers
     *   don't listen to it becase we are not interested for the response, we will not receive the response 
     */
    getPosts() {
        this.http.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    // Every element in the array will be converted to an object with post _id instead of id, and it will be put back into a new array
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    };
                });
            }))
            .subscribe((transformedPosts) => {
                // Function that will be executed whenever we get a response 
                this.posts = transformedPosts;
                // .next() method will be called by the Observable whenever a new value is emitter (whenever we receive a new value)
                this.postsUpdated.next([...this.posts]);
            });
    }

    // Returns an object to which we can listen the post updating
    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
 
    getPost(id: string) {
        return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
    }

    // Method for adding a new post where I expect to get a post id, title and post content as an argument
    addPost(title: string, content: string) {
        const post: Post = {
            id: null,
            title: title,
            content: content
        }

        this.http.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
            .subscribe(responseData => {
                const id = responseData.postId;
                post.id = id;
                // Update my posts array with new post 
                this.posts.push(post);

                /**
                 * Push a new emitted value and this value is a copy of my posts after I updated them
                 * Emitting whenever I add a new posts
                 */
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            })
    }

    // Update (edit) post
    updatePost(id: string, title: string, content: string) {
        const post: Post = {  id: id, title: title, content: content };
        this.http.put("http://localhost:3000/api/posts/" + id, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    // Delete post
    deletePost(postId: string) {
        this.http.delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(() => {
                /**
                 * Update the frontend after deleting the post
                 * 
                 * This function will be executed for every post in the array and if it returns true
                 * then that element will be kept, and if returns false then that element will not be part
                 * of the new filtered posts array
                 * 
                 * My condition here is that post.id is not equal to postId because I want to keep all entries
                 * where the condition is not equal, and I want to delete the one where it is equal
                 */
                const updatePosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatePosts;
                this.postsUpdated.next([...this.posts]);
            });
    }
}