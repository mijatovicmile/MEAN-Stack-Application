import { Injectable } from '@angular/core';

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

    // Method for getting (fetching) all posts
    getPosts() {

        /**
         * Create a new array and with using spread operators I will pull all elements from posts array 
         * and add them to this new array, so I am creating a new array with the old objects and
         * therefore old array has been copied 
         */
        return [...this.posts];
    }

    // Returns an object to which we can listen the post updating
    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    // Method for adding a new post where I expect to get a post title and post content as an argument
    addPost(title: string, content: string) {
        const post: Post = {
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