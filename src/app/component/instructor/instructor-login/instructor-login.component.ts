import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../shared/firebase.service';

@Component({
  selector: 'app-instructor-login',
  templateUrl: './instructor-login.component.html',
  styleUrls: ['./instructor-login.component.css'],
})
export class InstructorLoginComponent {
  loginForm: FormGroup;
  successMessage = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
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

    if (email === 'admin@admin.com' && password === 'admin') {
      // Redirect to admin dashboard if admin credentials are used
      this.router.navigate(['/admin-dashboard']);
    } else {
      // For other users, use Firebase authentication
      try {
        // Call your Firebase authentication service to log in the user
        await this.firebaseService.loginInstructorWithEmailAndPassword(
          email,
          password
        );

        // If login successful, redirect to the instructor dashboard
        this.router.navigate(['/instructor-dashboard']);
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
  backbutton() {
    this.router.navigate(['/teachonelearning']);
  }
}
