import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../../shared/assignment-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CourseService } from '../../../shared/course.service';

@Component({
  selector: 'app-management-assignment',
  templateUrl: './management-assignment.component.html',
  styleUrls: ['./management-assignment.component.css'],
})
export class ManagementAssignmentComponent implements OnInit {
  assignments: {
    type: string;
    url: SafeUrl;
    displayName: string;
    studentName: string;
    studentId: string;
    courseName: string;
    grade: string;
    docid: string;
  }[] = [];
  courseName: string = '';

  constructor(
    private assignmentService: AssignmentService,
    private sanitizer: DomSanitizer,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {}

  async fetchAssignments(): Promise<void> {
    try {
      const courseId = await this.getCourseIdByName(this.courseName);
      if (courseId) {
        const assignments =
          await this.assignmentService.getAssignmentsForStudent(courseId);
        console.log(assignments);
        this.assignments = assignments.map((assignment: any) => {
          const url = this.sanitizer.bypassSecurityTrustResourceUrl(
            assignment.url
          );
          let displayName = assignment.type;
          console.log(displayName);
          return {
            type: assignment.type,
            url: url,
            displayName: displayName,
            studentName: assignment.studentName,
            studentId: assignment.studentId,
            courseName: assignment.courseName,
            grade: assignment.grade,
            docid: assignment.docId,
          };
        });
      } else {
        console.error('Course not found');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  }

  async getCourseIdByName(courseName: string): Promise<string | null> {
    try {
      const courses = await this.courseService.getCoursesByNames([courseName]);
      return courses.length > 0 ? courses[0].id : null;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  async setGrade(
    studentId: string,
    assignment: any,
    newgrade: string
  ): Promise<void> {
    console.log(studentId);
    console.log(newgrade);
    console.log(assignment);
    try {
      const courseId = await this.getCourseIdByName(this.courseName);
      if (courseId) {
        console.log(courseId); // Log the retrieved course ID
        console.log(assignment.docid);
        const assignmentId = assignment.docid;
        console.log(assignmentId);
        await this.assignmentService.setGradeForStudentAssignment(
          courseId,
          assignmentId,
          newgrade
        );
        console.log('Grade set successfully.');
      } else {
        console.error('Course not found');
      }
    } catch (error) {
      console.error('Error setting grade:', error);
    }
  }
}
