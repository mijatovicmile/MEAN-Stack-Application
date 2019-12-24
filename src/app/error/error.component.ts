import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.css"]
})
export class ErrorComponent implements OnInit {
  message = "An unknown error occured";

  constructor(
    public dialogRef: MatDialogRef<ErrorComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  ngOnInit() {}
}
