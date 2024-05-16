import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../../model/course';
import { CourseService } from '../../../shared/course.service';
import { FirebaseService } from '../../../shared/firebase.service'; // Import FirebaseService

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css'],
})
export class StudentHomeComponent implements OnInit {
  courses: Course[] = [];
  userData: any; // Define userData property to store user data

  constructor(
    private router: Router,
    private courseService: CourseService,
    private firebaseService: FirebaseService // Inject FirebaseService
  ) {}

  ngOnInit() {
    // Retrieve user data from local storage
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
      // Parse the user data from JSON string
      this.userData = JSON.parse(userDataString);
      console.log(this.userData);

      // Fetch courses for the current user
      this.fetchCourses();
    } else {
      console.error('User data not found in local storage.');
    }
  }

  async fetchCourses() {
    try {
      // Fetch courses for the current user
      this.courses = await this.courseService.getCoursesByStudentId(
        this.userData['id']
      );
    } catch (error) {
      console.error('Error fetching courses for user:', error);
    }
  }

  goToCourse(courseId: string, index: number) {
    console.log(index);
    // Save the index of the selected course in local storage
    localStorage.setItem('selectedCourseIndex', index.toString());
    console.log(localStorage);
    // Navigate to the course details page
    this.router.navigate(['/course', courseId]);
  }

  goToMyLearning() {
    // Navigate to the My learning page with the user ID
    if (this.userData) {
      this.router.navigate(['/studentLearningPage', this.userData.id]);
    } else {
      console.error('User data not available.');
    }
  }

  logout() {
    // Clear user data from local storage
    localStorage.removeItem('userData');
    this.router.navigate(['/home']);
  }
}
