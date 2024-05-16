import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../shared/course.service'; // Update with correct path
import { Course } from '../../../model/course';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css'],
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  selectedSection: string = 'courseManagement';
  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit() {
    this.getCourses();
  }

  async getCourses() {
    try {
      this.courses = await this.courseService.getAllCourses();
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  approveCourse(courseId: string) {
    this.courseService.approveCourse(courseId).then(
      () => {
        console.log('Course approved successfully');
        // Reload courses after approval
        this.getCourses();
      },
      (error: any) => {
        console.error('Error approving course:', error);
      }
    );
  }
  showSection(section: string) {
    this.selectedSection = section;
  }
  logout() {
    this.router.navigate(['/home']);
  }
}
