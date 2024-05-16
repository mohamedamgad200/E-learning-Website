import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AssignmentMetaData } from '../model/assignment-meta-data';
import { AssignmentStudentMetaData } from '../model/assignment-student-meta-data';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  where,
  setDoc,
  QuerySnapshot,
  query,
  getFirestore,
  getDoc,
} from 'firebase/firestore';
@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  constructor(private fireStore: AngularFirestore) {}

  async saveMetaDataOfAssignment(
    courseId: string,
    assignmentObj: AssignmentMetaData
  ): Promise<void> {
    try {
      const assignmentMeta = {
        name: assignmentObj.name,
        url: assignmentObj.url,
        size: assignmentObj.size,
      };

      // Add assignment metadata to Firestore under the specified course
      const docRef = await this.fireStore
        .collection(`courses/${courseId}/assignments`)
        .add(assignmentMeta);

      // Set the id property of AssignmentMetaData to the id of the newly created document
      assignmentObj.id = docRef.id;
    } catch (error) {
      console.error('Error saving assignment metadata:', error);
      throw error;
    }
  }
  async saveMetaDataOfAssignmentsStudent(
    courseId: string,
    courseName: string,
    studentName: string,
    studentId: string,
    assignmentObj: AssignmentStudentMetaData
  ): Promise<void> {
    try {
      // Create assignment metadata object
      const assignmentMeta = {
        name: assignmentObj.name,
        url: assignmentObj.url,
        size: assignmentObj.size,
        studentName: studentName,
        studentId: studentId,
        courseName: courseName,
        grade: '',
      };

      // Add assignment metadata to Firestore under the specified course and student
      const docRef = await this.fireStore
        .collection(`courses/${courseId}/studentsassignments`)
        .add(assignmentMeta);

      // Set the id property of AssignmentMetaData to the id of the newly created document
      assignmentObj.id = docRef.id;
      console.log('Assignment metadata saved successfully');
    } catch (error) {
      console.error('Error saving assignment metadata:', error);
      throw error;
    }
  }

  getAllAssignments(courseId: string): Observable<any[]> {
    return this.fireStore
      .collection(`courses/${courseId}/assignments`)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as AssignmentMetaData;
            const docId = a.payload.doc.id;
            return { docId, ...data };
          })
        )
      );
  }
  async getAssignmentsForStudent(courseId: string): Promise<
    {
      docId: string;
      type: string;
      url: string;
      studentName: string;
      studentId: string;
      courseName: string;
      grade: string;
    }[]
  > {
    try {
      const assignments: {
        docId: string;
        type: string;
        url: string;
        studentName: string;
        studentId: string;
        courseName: string;
        grade: string;
      }[] = [];
      const querySnapshot = await getDocs(
        collection(getFirestore(), `courses/${courseId}/studentsassignments`)
      );
      querySnapshot.forEach((doc) => {
        const assignment = doc.data();
        const assignmentUrl = assignment['url'];
        if (assignmentUrl) {
          const type = getFileTypeFromUrl(assignmentUrl);
          assignments.push({
            docId: doc.id,
            url: assignmentUrl,
            type: type,
            studentName: assignment['studentName'],
            studentId: assignment['studentId'],
            courseName: assignment['courseName'],
            grade: assignment['grade'] || '', // Ensure default value if grade is missing
          });
        }
      });
      return assignments;
    } catch (error) {
      console.error('Error getting student assignments:', error);
      throw error;
    }
  }
  async setGradeForStudentAssignment(
    courseId: string,
    docId: string,
    newGrade: string
  ): Promise<void> {
    try {
      const studentAssignmentRef = doc(
        getFirestore(),
        `courses/${courseId}/studentsassignments/${docId}`
      );
      await updateDoc(studentAssignmentRef, {
        grade: newGrade,
      });
      console.log('Grade set successfully.');
    } catch (error) {
      console.error('Error setting grade:', error);
      throw error;
    }
  }
  async deleteAssignment(
    courseId: string,
    assignmentId: string
  ): Promise<void> {
    try {
      // Delete assignment metadata
      await this.fireStore
        .doc(`courses/${courseId}/assignments/${assignmentId}`)
        .delete();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  }
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
  getAssignmentIdByName(
    courseId: string,
    assignmentName: string
  ): Observable<string | null> {
    return this.fireStore
      .collection(`courses/${courseId}/assignments`, (ref) =>
        ref.where('name', '==', assignmentName)
      )
      .get()
      .pipe(
        map((querySnapshot) => {
          if (querySnapshot.size === 0) {
            return null; // Assignment not found
          } else {
            // Return the first matching document ID
            return querySnapshot.docs[0].id;
          }
        })
      );
  }
  async getSumOfGradesForStudent(
    studentName: string,
    courseId: string
  ): Promise<number> {
    try {
      const studentAssignmentsRef = collection(
        getFirestore(),
        `courses/${courseId}/studentsassignments`
      );
      const q = query(
        studentAssignmentsRef,
        where('studentName', '==', studentName)
      );
      const querySnapshot = await getDocs(q);

      let sumOfGrades = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data['grade']) {
          sumOfGrades += parseFloat(data['grade']);
        }
      });

      return sumOfGrades;
    } catch (error) {
      console.error('Error getting sum of grades for student:', error);
      throw error;
    }
  }
}
function getFileTypeFromUrl(url: string): string {
  const parts = url.split('?')[0]; // Split at the first question mark
  const extension = parts.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') {
    return 'pdf';
  } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
    return 'image';
  } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
    return 'video';
  } else {
    return 'unknown';
  }
}
