import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Import the post model
import { Post } from '../post.model';

// Import the Post Service 
import { PostService } from '../posts.service';

// Contains the information about a route associated with a component loaded in an outlet
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
    postTitle = '';
    postContent = '';
    post: Post;
    spinnerIsLoading = false;
    private mode = 'create';
    private postId: string;

    constructor(public postService: PostService, public route: ActivatedRoute) {}

    ngOnInit() {
        /**
         * Find out whether we have a post ID parameter or not
         * paramMap is observable to which we can subscribe, and with that we can listen to changes
         * in the route, or in the parameters to be precise, and we can therefore react to that
         * and update our UI
         */
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.spinnerIsLoading = true;
                this.postService.getPost(this.postId).subscribe(postData => {
                    this.spinnerIsLoading = false;
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content
                    }
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    // On submiting post data (title and content) - when I created new post
    onSavePost(form: NgForm) {
        if(form.invalid) {
            return;
        } 
        this.spinnerIsLoading = true;
        if(this.mode == 'create') {
            this.postService.addPost(form.value.title, form.value.content);
        } else {
            this.postService.updatePost(this.postId, form.value.title, form.value.content);
        }
        // Reset the form after submiting the post data
        form.resetForm();
    }
}