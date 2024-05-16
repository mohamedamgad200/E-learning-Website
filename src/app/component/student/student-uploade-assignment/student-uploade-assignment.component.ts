import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../../shared/assignment-service.service';
import { AssignmentStudentMetaData } from '../../../model/assignment-student-meta-data';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-uploade-assignment',
  templateUrl: './student-uploade-assignment.component.html',
  styleUrls: ['./student-uploade-assignment.component.css'],
})
export class StudentUploadeAssignmentComponent implements OnInit {
  selectedFiles!: FileList;
  currentFileUpload!: AssignmentStudentMetaData;
  percentage: number = 0;
  courseName: string = ''; // Course Name
  courseId: string = ''; // Course ID
  listOfFiles: AssignmentStudentMetaData[] = [];
  currentStudentId: string = ''; // Initialize currentStudentId with an empty string
  userId: string = ''; // User ID
  studentName: string = ''; // Student Name

  constructor(
    private assignmentService: AssignmentService,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Call a method to fetch the list of files when the component initializes
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  async uploadFile() {
    if (!this.courseName) {
      console.error('Course name is required.');
      return;
    }

    try {
      // Get course ID by name
      const course = await this.assignmentService
        .getCourseIdByName(this.courseName)
        .toPromise();
      if (!course) {
        console.error('Course not found.');
        return;
      }
      this.courseId = course.id;

      // Retrieve user data from local storage
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        console.error('User data not found in local storage.');
        return;
      }

      // Parse user data JSON
      const userData = JSON.parse(userDataString);
      const studentName = userData.name;
      const studentId = userData.id;

      // Upload file
      this.currentFileUpload = {
        name: this.selectedFiles[0].name,
        url: '',
        size: this.selectedFiles[0].size,
        studentName: studentName,
        studentId: studentId,
        courseName: this.courseName, // Add courseName property
        grade: undefined,
      };
      const path = `courses/${this.courseId}/students/${studentId}/assignments/${this.currentFileUpload.name}`;

      const storageRef = this.fireStorage.ref(path);
      const uploadTask = storageRef.put(this.selectedFiles[0]);

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            // Get the download URL of the uploaded file
            const downloadLink = await storageRef.getDownloadURL().toPromise();
            this.currentFileUpload.url = downloadLink;

            // Save file metadata to Firestore
            await this.assignmentService.saveMetaDataOfAssignmentsStudent(
              this.courseId,
              this.courseName,
              studentName,
              studentId,
              this.currentFileUpload
            );
          })
        )
        .subscribe(
          (res: any) => {
            this.percentage = (res.bytesTransferred * 100) / res.totalBytes;
          },
          (err) => {
            console.log('Error occurred');
          }
        );
    } catch (error) {
      console.error('Error:', error);
    }
  }
  back() {
    this.router.navigate(['/studentHomePage']);
  }
}
