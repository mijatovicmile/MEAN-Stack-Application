import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Contains the information about a route associated with a component loaded in an outlet
import { ActivatedRoute, ParamMap } from '@angular/router';

// Import the Post Service 
import { PostService } from '../posts.service';

// Import the post model
import { Post } from '../post.model';

// Import MIME Type Validator
import { mimeType } from './mime-type.validator';


@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
    postTitle = '';
    postContent = '';
    postForm: FormGroup;
    post: Post;
    spinnerIsLoading = false;
    imagePreview: string;
    private mode = 'create';
    private postId: string;

    constructor(public postService: PostService, public route: ActivatedRoute) {}

    ngOnInit() {
        
        // Creating a FormGroup instance for reactive form
        this.postForm = new FormGroup({
            title: new FormControl(null, { 
                validators: [Validators.required, Validators.minLength(3)]
            }),
            content: new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        })

        /**
         * Find out whether we have a post ID parameter or not
         * paramMap is observable to which we can subscribe, and with that we can listen to changes
         * in the route, or in the parameters to be precise, and we can therefore react to that
         * and update our UI
         */
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.spinnerIsLoading = true;
                this.postService.getPost(this.postId).subscribe(postData => {
                    this.spinnerIsLoading = false;
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content,
                        imagePath: postData.imagePath
                    };
                    /**
                     * Reactive forms have methods to change a control's value programmatically, 
                     * which gives you the flexibility to update the value without user interaction. 
                     * A form control instance provides a setValue() method that updates the value of 
                     * the form control and validates the structure of the value provided against the 
                     * control's structure
                     */
                    this.postForm.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath
                    });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onImagePicked(event: Event) {
        /**
         * Target on which user will click (file picker)
         * 
         * Because TypeScript does not know that our event target actually is file input
         * and therefore does not know that this property exist, and I will wrap event target 
         * with parentheses and then add as HTMLInputElement (type conversion), which tells TypeScript
         * that entire expression will be HTML input element 
         */
        const file = (event.target as HTMLInputElement).files[0];

        // Patch value allows us to target a single form control, which is an image in my case
        this.postForm.patchValue({image: file});
          
        // Recalculates the value and validation status of the control
        this.postForm.get('image').updateValueAndValidity();
        
        // Convert image to data URL that can be used by the image tag
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    // On submiting post data (title and content) - when I created new post
    onSavePost() {
        if(this.postForm.invalid) {
            return;
        } 
        this.spinnerIsLoading = true;
        if(this.mode == 'create') {
            this.postService.addPost(
              this.postForm.value.title,
              this.postForm.value.content,
              this.postForm.value.image
            );
        } else {
            this.postService.updatePost(
              this.postId,
              this.postForm.value.title,
              this.postForm.value.content,
              this.postForm.value.image
            );
        }
        // Reset the form after submiting the post data
        this.postForm.reset();
    }
}