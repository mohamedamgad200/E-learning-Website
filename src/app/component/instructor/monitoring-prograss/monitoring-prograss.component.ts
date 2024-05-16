import { Component } from '@angular/core';
import { CourseService } from '../../../shared/course.service';

@Component({
  selector: 'app-monitoring-prograss',
  templateUrl: './monitoring-prograss.component.html',
  styleUrls: ['./monitoring-prograss.component.css'],
})
export class MonitoringPrograssComponent {
  courseName: string = '';
  students: any[] = [];

  constructor(private courseService: CourseService) {}

  async getCourseStudents() {
    try {
      if (!this.courseName.trim()) {
        alert('Please enter a course name.');
        return;
      }

      this.students = await this.courseService.getStudentsByCourseName(
        this.courseName
      );
      console.log(this.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }
}
