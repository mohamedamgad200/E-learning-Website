import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../shared/assignment-service.service';
import { FileMetaData } from '../../model/file-meta-data';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-assigment-uploade',
  templateUrl: './assigment-uploade.component.html',
  styleUrl: './assigment-uploade.component.css',
})
export class AssigmentUploadeComponent implements OnInit {
  selectedFiles!: FileList;
  currentFileUpload!: FileMetaData;
  percentage: number = 0;
  courseName: string = ''; // Course Name
  courseId: string = ''; // Course ID
  listOfFiles: FileMetaData[] = [];

  constructor(
    private fileService: AssignmentService,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Call a method to fetch the list of files when the component initializes
    this.getAllFiles();
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
      const course = await this.fileService
        .getCourseIdByName(this.courseName)
        .toPromise();
      if (!course) {
        console.error('Course not found.');
        return;
      }
      this.courseId = course.id;

      // Upload file
      this.currentFileUpload = new FileMetaData(this.selectedFiles[0]);
      const path = `courses/${this.courseId}/${this.currentFileUpload.file.name}`;

      const storageRef = this.fireStorage.ref(path);
      const uploadTask = storageRef.put(this.selectedFiles[0]);

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe((downloadLink) => {
              this.currentFileUpload.id = '';
              this.currentFileUpload.url = downloadLink;
              this.currentFileUpload.size = this.currentFileUpload.file.size;
              this.currentFileUpload.name = this.currentFileUpload.file.name;

              // Save file metadata to Firestore
              this.fileService.saveMetaDataOfAssignment(
                this.courseId,
                this.currentFileUpload
              );
              // Refresh the list of files after upload
              this.getAllFiles();
            });
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

  async deleteFile(file: FileMetaData) {
    if (window.confirm('Are you sure you want to delete ' + file.name + '?')) {
      try {
        // Get course ID by name
        const course = await this.fileService
          .getCourseIdByName(this.courseName)
          .toPromise();
        if (!course) {
          console.error('Course not found.');
          return;
        }
        const courseId = course.id;

        // Find fileId by fileName
        const fileId = await this.fileService
          .getAssignmentIdByName(courseId, file.name)
          .toPromise();
        if (!fileId) {
          console.error('File ID not found for file:', file);
          return;
        }

        // Delete the file
        await this.fileService.deleteAssignment(courseId, fileId);

        // Refresh the list of files after deletion
        this.getAllFiles();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  }

  getAllFiles() {
    if (!this.courseName) {
      console.error('Course name is required.');
      return;
    }

    try {
      // Get course ID by name
      this.fileService
        .getCourseIdByName(this.courseName)
        .subscribe((course) => {
          if (!course) {
            console.error('Course not found.');
            return;
          }
          this.courseId = course.id;

          // Fetch list of files for the course
          this.fileService.getAllAssignments(this.courseId).subscribe(
            (files) => {
              this.listOfFiles = files;
            },
            (error) => {
              console.error('Error fetching files:', error);
            }
          );
        });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  back() {
    this.router.navigate(['/instructor-dashboard']);
  }
}
