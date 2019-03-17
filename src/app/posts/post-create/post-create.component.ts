import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

// Import the Post Service 
import { PostService } from '../posts.service';

@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
    postTitle = '';
    postContent = '';

    constructor(public postService: PostService) {}

    // On submiting post data (title and content) - when I created new post
    onAddPost(form: NgForm) {
        if(form.invalid) {
            return;
        } 
        this.postService.addPost(form.value.title, form.value.content);

        // Reset the form after submiting the post data
        form.resetForm();
    }
}