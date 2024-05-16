import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { FirebaseService } from '../../../shared/firebase.service'; // Adjust the path as per your project structure

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css'],
})
export class StudentManagementComponent {
  studentForm: FormGroup; // Declare a FormGroup variable for the student form
  courseName: string;

  constructor(
    private formBuilder: FormBuilder, // Inject FormBuilder
    private firebaseService: FirebaseService
  ) {
    this.studentForm = this.formBuilder.group({
      studentId: [null, Validators.required], // Set up form controls with validation
      courseName: ['', Validators.required],
    });
    this.courseName = '';
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      console.error('Please fill in all required fields.');
      return;
    }

    const studentId = this.studentForm.value.studentId;
    const courseName = this.studentForm.value.courseName;

    this.addCourseToStudent(studentId, courseName);
  }

  async addCourseToStudent(
    studentId: number,
    courseName: string
  ): Promise<void> {
    try {
      await this.firebaseService.addCourseToStudent(studentId, courseName);
      // If successful, you can perform additional actions here
    } catch (error) {
      console.error('Error adding course to student:', error);
      // Handle errors appropriately
    }
  }
}
