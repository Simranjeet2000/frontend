import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  supabase = createClient(
    'https://htffpaaageouvcjsjpna.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmZwYWFhZ2VvdXZjanNqcG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzMjAzOTgsImV4cCI6MjAxMzg5NjM5OH0.WMurcvg6hQnfMoKxDAbWj0IH8HSLC_bCiQG8iOBQnyQ'
  );

  constructor(private router: Router, private userservice: UserService) {}

  myFormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(18),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z][\w.-]*@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.*[A-Z]).*$/),
    ]),
  });

  async signUp() {
    const emailValue: string = this.myFormGroup.value.email!;
    const { username, email, password } = this.myFormGroup.value;

    try {
      // Check if the user already exists in the usertable
      const existingUser = await this.supabase
        .from('usertable')
        .select('*')
        .eq('email', emailValue)
        .single();

      if (existingUser.data) {
        // User already exists
        this.showModalWithMessage(
          'Error',
          'User with this email already exists'
        );
        return;
      }

      const userId = this.userservice.generateUserId();
      // If the user doesn't exist, proceed with signup
      const signUpResult = await this.supabase.auth.signUp({
        email: emailValue,
        password: this.myFormGroup.value.password as string,
      });

      if (!signUpResult.error) {
        // Successful signup
        // this.showModalWithMessage('Success', 'User signed up successfully!');

        const insertResult = await this.supabase
          .from('usertable')
          .insert([{ userId, username, email, password }]);

        if (insertResult.error) {
          // Handle error during insert if needed
          this.showModalWithMessage(
            'Error',
            `Error during signup: ${signUpResult.error}`
          );
        } else {
          // Redirect to the login page after successful signup
          this.router.navigate(['/login']);
        }
      } else {
        // Handle signup error
        this.showModalWithMessage(
          'Error',
          `Error during signup: ${signUpResult.error.message}`
        );
      }
    } catch (error) {
      // Handle unexpected errors
      this.showModalWithMessage('Error', `Unexpected error: ${error}`);
    }
  }

  closeModal(): void {
    this.showModal = false;
    // Additional logic to handle modal close if needed
  }

  // Add a method to check if a specific field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const control = this.myFormGroup.get(fieldName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  private showModalWithMessage(title: string, message: string): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  // Custom validator function
  passwordValidator(control: FormControl) {
    const value: string = control.value;

    // Check if the password contains at least one character and one number
    const hasCharacter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);

    if (!hasCharacter || !hasNumber) {
      // Return an error object if the validation fails
      return {
        passwordRequirements: true,
      };
    }

    // Return null if the validation passes
    return null;
  }
}
