import { Component } from '@angular/core';
import { PostgrestError, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  check: string = '';
  supabase = createClient(
    'https://htffpaaageouvcjsjpna.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmZwYWFhZ2VvdXZjanNqcG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzMjAzOTgsImV4cCI6MjAxMzg5NjM5OH0.WMurcvg6hQnfMoKxDAbWj0IH8HSLC_bCiQG8iOBQnyQ'
  );

  constructor(private router: Router) {}

  myLoginForm = new FormGroup({
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

  async login() {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: this.myLoginForm.value.email!,
        password: this.myLoginForm.value.password!,
      });

      if (error) {
        console.error('Error signing in:', error.message);
        this.showModalWithMessage(
          'Error',
          'Invalid credentials. Please try again.'
        );
      } else if (data) {
        // User is successfully authenticated and email is confirmed
        const { data, error: fetchError } = await this.supabase
          .from('usertable')
          .select('username, userId')
          .eq('email', this.myLoginForm.value.email)
          .single();

        if (fetchError && (fetchError as PostgrestError).code !== '23505') {
          console.error('Error fetching user:', fetchError.message);
        }

        if (data) {
          const username = data.username;
          const userId = data.userId;
          localStorage.setItem('username', username);
          localStorage.setItem('userId', userId.toString());
          this.router.navigate(['/dashboard']);
        } else {
          this.showModalWithMessage('Error', 'Failed to fetch user data.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  closeModal(): void {
    this.showModal = false;
    // Additional logic to handle modal close if needed
  }

  // Add a method to check if a specific field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const control = this.myLoginForm.get(fieldName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  private showModalWithMessage(title: string, message: string): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }
}
