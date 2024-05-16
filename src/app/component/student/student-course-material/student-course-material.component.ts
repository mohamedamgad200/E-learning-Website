import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../shared/course.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { AssignmentService } from '../../../shared/assignment-service.service'; // Import AssignmentService

@Component({
  selector: 'app-student-course-material',
  templateUrl: './student-course-material.component.html',
  styleUrls: ['./student-course-material.component.css'],
})
export class StudentCourseMaterialComponent implements OnInit {
  courseMaterials: { type: string; url: SafeUrl; displayName: string }[] = [];
  assignments: { type: string; url: SafeUrl; displayName: string }[] = [];
  courseId: string = '';
  id: string = '';
  studentName: string = ''; // Add studentName property
  sumOfGrades: number = 0; // Add sumOfGrades property
  checkboxes: boolean[] = [];
  selectedCourseIndex: number | null = null; // Initialize selectedCourseIndex variable
  complete: boolean | null = null; // Initialize complete variable

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private assignmentService: AssignmentService, // Inject AssignmentService
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.courseId = id;
        this.fetchCourseMaterials(this.courseId);
        this.fetchAssignments(this.courseId);
        this.fetchStudentName(); // Fetch student name on component initialization
        this.fetchSumOfGrades(); // Fetch sum of grades on component initialization
        this.loadCheckboxState();
        this.selectedCourseIndex = parseInt(
          localStorage.getItem('selectedCourseIndex') || '0',
          10
        ); // Retrieve selected course index from local storage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          if (
            userData.courses &&
            userData.courses.length > this.selectedCourseIndex
          ) {
            console.log(userData);
            console.log(userData.courses);
            this.complete =
              userData.courses[this.selectedCourseIndex].completed; // Retrieve complete status of selected course
            console.log(userData.courses[this.selectedCourseIndex].complete);
            console.log(this.complete);
          } else {
            console.error('Selected course not found in user data.');
          }
        } else {
          console.error('User data not found in local storage.');
        }
      } else {
        console.error('Course ID is null');
      }
    });
  }

  async fetchSumOfGrades(): Promise<void> {
    try {
      this.sumOfGrades = await this.getSumOfGradesForStudent(
        this.studentName,
        this.courseId
      );
    } catch (error) {
      console.error('Error fetching sum of grades:', error);
    }
  }

  async fetchStudentName(): Promise<void> {
    try {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        this.studentName = userData.name;
      } else {
        console.error('User data not found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching student name:', error);
    }
  }

  async fetchCourseMaterials(courseId: string) {
    try {
      const materials = await this.courseService.getCourseMaterials(courseId);
      console.log(materials);
      this.courseMaterials = materials.map((material: any) => {
        const url = this.sanitizer.bypassSecurityTrustResourceUrl(material.url);
        let displayName = material.type;
        console.log(displayName);
        return {
          type: material.type,
          url: url,
          displayName: displayName,
        };
      });
    } catch (error) {
      console.error('Error fetching course materials:', error);
    }
  }

  async fetchAssignments(courseId: string) {
    try {
      const assignments = await this.courseService.getCourseAssignments(
        courseId
      );
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
        };
      });
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/studentHomePage']); // Replace '/studentHomePage' with the route to your home page if needed
  }

  navigateToUploade(): void {
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.id, // Use the id property here
      },
    };
    this.router.navigate(['assignments/course'], navigationExtras);
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  async getSumOfGradesForStudent(
    studentName: string,
    courseId: string
  ): Promise<number> {
    try {
      // Call the function from the assignment service with both parameters
      const sumOfGrades = await this.assignmentService.getSumOfGradesForStudent(
        studentName,
        courseId
      );
      return sumOfGrades;
    } catch (error) {
      console.error('Error getting sum of grades for student:', error);
      throw error;
    }
  }

  onCheckboxChange(index: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkboxes[index] = isChecked;
    localStorage.setItem('checkboxes', JSON.stringify(this.checkboxes)); // Save checkbox state in local storage

    // Check if all checkboxes are checked
    if (this.checkboxes.every((checkbox) => checkbox)) {
      console.log('All checkboxes are checked.');
      const docID = localStorage.getItem('docID');
      const selectedCourseIndex = this.selectedCourseIndex; // Retrieve selected course index

      // Check if both docID and selectedCourseIndex exist
      if (docID !== null && selectedCourseIndex !== null) {
        // Call the updateDocument method of courseService with the selectedCourseIndex
        this.courseService.updateDocument(docID, selectedCourseIndex); // Pass docID and selectedCourseIndex as parameters
      } else {
        console.error(
          'No document ID or selected course index found in localStorage.'
        );
      }
    }
  }
  loadCheckboxState(): void {
    const storedCheckboxes = localStorage.getItem('checkboxes');
    if (storedCheckboxes) {
      this.checkboxes = JSON.parse(storedCheckboxes);
    } else {
      // Initialize checkboxes to all unchecked if no state found in localStorage
      this.checkboxes = new Array(this.assignments.length).fill(false);
    }
  }
}
