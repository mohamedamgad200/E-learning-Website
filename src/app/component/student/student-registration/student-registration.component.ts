import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { FirebaseService } from '../../../shared/firebase.service'; // Update the path to FirebaseService

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.css'],
  providers: [FirebaseService],
})
export class StudentRegistrationComponent implements OnInit {
  registrationForm!: FormGroup; // Initialized in the ngOnInit lifecycle hook
  successMessage = '';
  constructor(
    private fb: FormBuilder,
    private router: Router, // Inject Router
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(formGroup: FormGroup | null) {
    if (!formGroup) {
      return; // Exit early if formGroup is null
    }

    const password = formGroup.get('password')?.value; // Use optional chaining
    const confirmPassword = formGroup.get('confirmPassword')?.value; // Use optional chaining

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordsMismatch: true }); // Use optional chaining
    } else {
      formGroup.get('confirmPassword')?.setErrors(null); // Use optional chaining
    }
  }

  async register() {
    if (!this.registrationForm) {
      return; // Null check to handle the possibility of registrationForm being null
    }

    if (this.registrationForm.invalid) {
      return;
    }

    const { email, password, name } = this.registrationForm.value;

    try {
      await this.firebaseService.registerWithEmailAndPassword({
        email,
        password,
        name,
      });
      // Set success message
      this.successMessage =
        'Registration successful. Please wait for admin activation.';

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 1000);
      // Registration successful, navigate to login page
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
    } catch (error) {
      // Handle registration error, e.g., display error message to the user
      console.error('Registration failed:', error);
      // Set error message
      this.successMessage = 'Invalid Username or password';
    }
  }
}
