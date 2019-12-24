import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

/**
 * Mime type validator will have the task of getting the value of a control which will be a file,
 * reads data using FileReader and then check for the mime type of that file
 */

/**
 * Validator will be a function which read control value and return the whether that is valid or not.
 *
 * This will be an asynchronous validator because reading in that file with the FileReader is an async task.
 * Since it's a async validator, I have to define a special return type for this validator function.
 *
 * A normal synchronous validator would simply return a javascript object where we have a key value pair with
 * error code and then a value for that error code or null. If validator returns null, the value is treated to be valid.
 *
 * Null means valid if we return an object with that error code and that value for the error code - then that would mean it failed.
 *
 * For async validators it's almost the same but that JavaScript object with the error code is wrapped by a promise or an observable.
 *
 * @param control - The control is an argument which is of type AbstractControl
 */
export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof control.value === "string") {
    return of(null);
  }
  // Extract the file and I need to tell TypeScript that tis is a file because it could be anything I can store as a value
  const file = control.value as File;

  // Instantiated FileReader which can be used to read value of that file
  const fileReader = new FileReader();

  // Create a new Observable
  const fileReaderObservable = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
        /**
         * Create a new array of 8 bit unsigned integers and we can think of this as a way that allows us
         * to access or to read certain patterns in the file
         */
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
          0,
          4
        );
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          // Convert to hexadecimal string
          header += arr[i].toString(16);
        }
        switch (header) {
          /**
           * Here I will have a string which has a clearly defined pattern for the different file types
           * and here I check for certain patterns and these are patterns which stand for certain file types (png/jpg patterns)
           */
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        /**
         * Now when I have "isValid" variable ready, based on that I will
         * I will use observer to emit the data
         */
        if (isValid) {
          // Value will be null, because I have to return null and return here means - emit in the observable if it is valid
          observer.next(null);
        } else {
          // If is not valid
          observer.next({ invalidMimeType: true });
        }
        // Let any subscribers know that I am done
        observer.complete();
      });
      /**
       * Start the process by using our fileReader to read the file as a array buffer
       * which allows me to access the mime type
       */
      fileReader.readAsArrayBuffer(file);
    }
  );

  // Return Observable
  return fileReaderObservable;
};
