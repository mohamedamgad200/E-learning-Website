import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FileMetaData } from '../model/file-meta-data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssignmentStudentMetaData } from '../../app/model/assignment-student-meta-data';
@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {}

  async saveMetaDataOfFile(
    courseId: string,
    fileObj: FileMetaData
  ): Promise<void> {
    try {
      const fileMeta = {
        name: fileObj.name,
        url: fileObj.url,
        size: fileObj.size,
      };

      // Add file metadata to Firestore under the specified course
      const docRef = await this.fireStore
        .collection(`courses/${courseId}/files`)
        .add(fileMeta);

      // Set the id property of FileMetaData to the id of the newly created document
      fileObj.id = docRef.id;
      console.log(fileObj.id);
      fileObj.fileId = docRef.id;
    } catch (error) {
      console.error('Error saving file metadata:', error);
      throw error;
    }
  }

  // Get all files of a specific course
  getAllFiles(courseId: string): Observable<any[]> {
    return this.fireStore
      .collection(`courses/${courseId}/files`)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as FileMetaData;
            const docId = a.payload.doc.id; // Renamed 'id' to 'docId'
            return { docId, ...data }; // Use 'docId' instead of 'id'
          })
        )
      );
  }

  // Delete file from a specific course
  async deleteFile(
    courseId: string,
    fileId: string,
    fileName: string
  ): Promise<void> {
    try {
      // Delete file metadata
      await this.fireStore.doc(`courses/${courseId}/files/${fileId}`).delete();

      // Delete file from storage
      await this.fireStorage.ref(`courses/${courseId}/${fileName}`).delete();

      // Delete file reference from firestore collection
      await this.fireStore
        .collection(`courses/${courseId}/files`)
        .doc(fileId)
        .delete();
      console.log(courseId);
      console.log(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Get course ID by name
  getCourseIdByName(courseName: string): Observable<{ id: string } | null> {
    return this.fireStore
      .collection('courses', (ref) => ref.where('name', '==', courseName))
      .get()
      .pipe(
        map((querySnapshot) => {
          if (querySnapshot.size === 0) {
            return null;
          } else {
            const courseId = querySnapshot.docs[0].id;
            return { id: courseId };
          }
        })
      );
  }
  getFileIdByName(
    courseId: string,
    fileName: string
  ): Observable<string | null> {
    return this.fireStore
      .collection(`courses/${courseId}/files`, (ref) =>
        ref.where('name', '==', fileName)
      )
      .get()
      .pipe(
        map((querySnapshot) => {
          if (querySnapshot.size === 0) {
            return null; // File not found
          } else {
            // Return the first matching document ID
            return querySnapshot.docs[0].id;
          }
        })
      );
  }
}
