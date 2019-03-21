import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * A Subject is a special type of Observable which shares a single execution path among observers (EventEmitter)
 * Emitting data and listening to that data in different places of application (commication between components)
 */
import { Subject } from 'rxjs';

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
    constructor(private http: HttpClient) {}

    // Method for getting (fetching) all posts
    getPosts() {
        this.http.get<{message: string, posts: Post[]}>("http://localhost:8080/api/posts")
            .subscribe((postData) => {
                this.posts = postData.posts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    // Returns an object to which we can listen the post updating
    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
 
    // Method for adding a new post where I expect to get a post title and post content as an argument
    addPost(title: string, content: string) {
        const post: Post = {
            id: null,
            title: title,
            content: content
        }

        // Update my posts array with new post 
        this.posts.push(post);

        /**
         * Push a new emitted value and this value is a copy of my posts after I updated them
         * Emitting whenever I add a new post
         */
        this.postsUpdated.next([...this.posts]);
    }
}