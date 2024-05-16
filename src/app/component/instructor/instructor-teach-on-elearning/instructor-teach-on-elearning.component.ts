import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-instructor-teach-on-elearning',
  templateUrl: './instructor-teach-on-elearning.component.html',
  styleUrl: './instructor-teach-on-elearning.component.css',
})
export class InstructorTeachOnElearningComponent {
  constructor(private router: Router) {}

  redirectToRegister() {
    this.router.navigate(['/instructorRegister']);
  }
  redirectToLogin() {
    this.router.navigate(['/instructorLogin']);
  }
}
