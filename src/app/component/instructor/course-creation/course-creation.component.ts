import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../shared/course.service'; // Update with correct path
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-creation',
  templateUrl: './course-creation.component.html',
  styleUrls: ['./course-creation.component.css'],
})
export class CourseCreationComponent implements OnInit {
  courseForm!: FormGroup;

  constructor(
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.courseForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      instructor: ['', Validators.required],
    });
  }

  createCourse(): void {
    const formData = this.courseForm.value;

    // Pass the 'approved' parameter with a default value of false
    this.courseService
      .createCourse(formData, false)
      .then(() => {
        console.log('Course created successfully');
        this.resetForm();
      })
      .catch((error: any) => {
        console.error('Error creating course:', error);
      });
  }

  resetForm(): void {
    this.courseForm.reset();
  }

  uploade() {
    this.router.navigate(['/uploade-course']);
  }
  assigment() {
    this.router.navigate(['/uploade-assigment']);
  }
}
