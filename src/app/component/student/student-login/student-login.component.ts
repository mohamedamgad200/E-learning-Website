import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router if redirecting after login
import { FirebaseService } from '../../../shared/firebase.service'; // Update the path to FirebaseService

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css'],
})
export class StudentLoginComponent {
  loginForm: FormGroup;
  successMessage = '';
  constructor(
    private fb: FormBuilder,
    private router: Router, // Inject Router if redirecting after login
    private firebaseService: FirebaseService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      // Call your Firebase authentication service to log in the user
      await this.firebaseService.loginWithEmailAndPassword(email, password);
      // If login successful, redirect to the studentHomePage
      this.router.navigate(['/studentHomePage']); // Navigate to the desired route after successful login
      console.log(localStorage);
    } catch (error) {
      // Handle login error, e.g., display error message to the user
      this.successMessage = 'Invalid username or password';

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
      console.error('Login failed:', error);
    }
  }
}
