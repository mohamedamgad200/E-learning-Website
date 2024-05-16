// import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { FileService } from './shared/file.service';
// import { Course } from '../../src/app/model/course';
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   updateDoc,
//   doc,
//   setDoc,
//   QuerySnapshot,
//   query,
//   getFirestore,
// } from 'firebase/firestore';
// @Injectable({
//   providedIn: 'root',
// })
// export class CourseService {
//   constructor(private firestore: AngularFirestore) {}
//   private firestoree = getFirestore();
//   async createCourse(courseData: any, approved: boolean): Promise<void> {
//     try {
//       const courseDataWithApproved = { ...courseData, approved };
//       const coursesCollectionRef = collection(
//         this.firestore.firestore,
//         'courses'
//       );
//       await setDoc(doc(coursesCollectionRef), courseDataWithApproved);

//       console.log('Course created successfully:', courseDataWithApproved);
//       alert('Course created successfully:');
//     } catch (error) {
//       console.error('Error creating course:', error);
//       alert('Error creating course:');
//       throw error;
//     }
//   }

//   async approveCourse(courseId: string): Promise<void> {
//     try {
//       const courseRef = doc(this.firestore.firestore, 'courses', courseId);
//       await updateDoc(courseRef, { approved: true });
//       console.log('Course approved successfully');
//       alert('Course approved successfully');
//     } catch (error) {
//       console.error('Error approving course:', error);
//       alert('Error approving course');
//       throw error;
//     }
//   }

//   async getAllCourses(): Promise<Course[]> {
//     try {
//       const coursesCollectionRef = collection(
//         this.firestore.firestore,
//         'courses'
//       );
//       const querySnapshot: QuerySnapshot = await getDocs(coursesCollectionRef);
//       const courses: Course[] = [];
//       querySnapshot.forEach((doc) => {
//         const courseData = doc.data();
//         const course: Course = {
//           id: doc.id,
//           name: courseData['name'],
//           description: courseData['description'],
//           instructor: courseData['instructor'],
//           approved: courseData['approved'],
//           // Add other properties if needed
//         };
//         courses.push(course);
//       });
//       return courses;
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       throw error;
//     }
//   }
//   async getCourseMaterials(courseId: string): Promise<any[]> {
//     try {
//       const materials: any[] = [];
//       const querySnapshot = await getDocs(
//         collection(this.firestore, `courses/${courseId}/files`)
//       );

//       querySnapshot.forEach((doc) => {
//         const material = doc.data();
//         // Assuming each document has a field named 'url' containing the URL of the material
//         const materialUrl = material.url;
//         if (materialUrl) {
//           materials.push(materialUrl);
//         }
//       });
//       return materials;
//     } catch (error) {
//       console.error('Error getting course materials:', error);
//       throw error;
//     }
//   }

//   // async getCourseAssessments(courseId: string): Promise<any[]> {
//   //   try {
//   //     const assessments: any[] = [];
//   //     const querySnapshot = await getDocs(
//   //       collection(this.firestore.firestore, `courses/${courseId}/assessments`)
//   //     );
//   //     querySnapshot.forEach((doc) => {
//   //       const assessment = doc.data();
//   //       assessments.push(assessment);
//   //     });
//   //     return assessments;
//   //   } catch (error) {
//   //     console.error('Error getting course assessments:', error);
//   //     throw error;
//   //   }
//   // }

//   // async deleteCourse(courseId: string): Promise<void> {
//   //   try {
//   //     await deleteDoc(doc(this.firestore.firestore, 'courses', courseId));
//   //     console.log('Course deleted successfully');
//   //   } catch (error) {
//   //     console.error('Error deleting course:', error);
//   //     throw error;
//   //   }
//   // }

//   // async deleteMaterialFromCourse(
//   //   courseId: string,
//   //   materialId: string
//   // ): Promise<void> {
//   //   try {
//   //     await deleteDoc(
//   //       doc(
//   //         this.firestore.firestore,
//   //         `courses/${courseId}/materials`,
//   //         materialId
//   //       )
//   //     );
//   //     console.log('Material deleted from course successfully');
//   //   } catch (error) {
//   //     console.error('Error deleting material from course:', error);
//   //     throw error;
//   //   }
//   // }

//   // async deleteAssessmentFromCourse(
//   //   courseId: string,
//   //   assessmentId: string
//   // ): Promise<void> {
//   //   try {
//   //     await deleteDoc(
//   //       doc(
//   //         this.firestore.firestore,
//   //         `courses/${courseId}/assessments`,
//   //         assessmentId
//   //       )
//   //     );
//   //     console.log('Assessment deleted from course successfully');
//   //   } catch (error) {
//   //     console.error('Error deleting assessment from course:', error);
//   //     throw error;
//   //   }
//   // }

//   // async updateCourse(courseId: string, newData: any): Promise<void> {
//   //   try {
//   //     await updateDoc(
//   //       doc(this.firestore.firestore, 'courses', courseId),
//   //       newData
//   //     );
//   //     console.log('Course updated successfully');
//   //   } catch (error) {
//   //     console.error('Error updating course:', error);
//   //     throw error;
//   //   }
//   // }
// }
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FileService } from './file.service';
import { Course } from '../model/course';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  QuerySnapshot,
  query,
  getFirestore,
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { getDoc } from 'firebase/firestore/lite';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async createCourse(courseData: any, approved: boolean): Promise<void> {
    try {
      const courseDataWithApproved = { ...courseData, approved };
      const coursesCollectionRef = collection(
        getFirestore(), // Use getFirestore to access the Firestore instance
        'courses'
      );
      await setDoc(doc(coursesCollectionRef), courseDataWithApproved);

      console.log('Course created successfully:', courseDataWithApproved);
      alert('Course created successfully:');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course:');
      throw error;
    }
  }

  async approveCourse(courseId: string): Promise<void> {
    try {
      const courseRef = doc(getFirestore(), 'courses', courseId); // Use getFirestore to access the Firestore instance
      await updateDoc(courseRef, { approved: true });
      console.log('Course approved successfully');
      alert('Course approved successfully');
    } catch (error) {
      console.error('Error approving course:', error);
      alert('Error approving course');
      throw error;
    }
  }

  async getAllCourses(): Promise<Course[]> {
    try {
      const coursesCollectionRef = collection(
        getFirestore(), // Use getFirestore to access the Firestore instance
        'courses'
      );
      const querySnapshot: QuerySnapshot = await getDocs(coursesCollectionRef);
      const courses: Course[] = [];
      querySnapshot.forEach((doc) => {
        const courseData = doc.data();
        const course: Course = {
          id: doc.id,
          name: courseData['name'],
          description: courseData['description'],
          instructor: courseData['instructor'],
          approved: courseData['approved'],
          // Add other properties if needed
        };
        courses.push(course);
      });
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  async getCoursesByNames(courseNames: string[]): Promise<Course[]> {
    try {
      const allCourses = await this.getAllCourses(); // Fetch all courses
      // Filter courses based on the provided array of course names
      const filteredCourses = allCourses.filter((course) =>
        courseNames.includes(course.name)
      );
      return filteredCourses;
    } catch (error) {
      console.error('Error fetching courses by names:', error);
      throw error;
    }
  }

  async getCoursesByStudentId(studentId: number): Promise<Course[]> {
    try {
      // Assuming you have a Firestore collection named 'students'
      const studentsCollectionRef = collection(getFirestore(), 'students');
      const querySnapshot: QuerySnapshot = await getDocs(studentsCollectionRef);

      let studentCourses: { name: string; completed: boolean }[] = []; // Initialize studentCourses as an empty array of objects

      // Loop through the documents to find the student by ID
      querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        if (studentData && studentData['id'] === studentId) {
          // If the student is found, extract the courses array
          studentCourses = studentData['courses'];
        }
      });

      if (studentCourses.length === 0) {
        console.warn(`No courses found for student with ID ${studentId}`);
        return [];
      }

      // Extract course names from the studentCourses array
      const courseNames: string[] = studentCourses.map((course) => course.name);

      // Fetch courses based on the array of course names
      const courses: Course[] = await this.getCoursesByNames(courseNames);

      return courses;
    } catch (error) {
      console.error('Error fetching courses for student:', error);
      throw error;
    }
  }
  async getStudentsByCourseName(courseName: string): Promise<any[]> {
    try {
      // Assuming you have a Firestore collection named 'students'
      const studentsCollectionRef = collection(getFirestore(), 'students');
      const querySnapshot: QuerySnapshot = await getDocs(studentsCollectionRef);

      const students: any[] = [];

      // Loop through the documents to find students associated with the course
      querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        if (studentData && Array.isArray(studentData['courses'])) {
          // Check if the course name exists in the student's courses array
          const courses = studentData['courses'];
          const course = courses.find(
            (c: { name: string }) => c.name === courseName
          );
          if (course) {
            // Include the complete course object in the student's data
            const completeCourse = studentData['courses'].find(
              (c: { name: string }) => c.name === courseName
            );
            students.push({
              id: studentData['id'],
              name: studentData['name'],
              email: studentData['email'],
              course: completeCourse, // Include the complete course object
            });
          }
        }
      });

      if (students.length === 0) {
        console.warn(`No students found for course ${courseName}`);
      }

      return students;
    } catch (error) {
      console.error('Error fetching students for course:', error);
      throw error;
    }
  }

  async getCourseMaterials(
    courseId: string
  ): Promise<{ type: string; url: string }[]> {
    try {
      const materials: { type: string; url: string }[] = [];
      const querySnapshot = await getDocs(
        collection(getFirestore(), `courses/${courseId}/files`)
      );
      querySnapshot.forEach((doc) => {
        const material = doc.data();
        const materialUrl = material['url'];
        if (materialUrl) {
          const type = getFileTypeFromUrl(materialUrl); // MaterialUrl is checked to be not undefined
          materials.push({ url: materialUrl, type: type });
        }
      });
      return materials;
    } catch (error) {
      console.error('Error getting course materials:', error);
      throw error;
    }
  }

  async getCourseAssignments(
    courseId: string
  ): Promise<{ type: string; url: string }[]> {
    try {
      const assignments: { type: string; url: string }[] = [];
      const querySnapshot = await getDocs(
        collection(getFirestore(), `courses/${courseId}/assignments`)
      );
      querySnapshot.forEach((doc) => {
        const assignment = doc.data();
        const assignmentUrl = assignment['url'];
        if (assignmentUrl) {
          const type = getFileTypeFromUrl(assignmentUrl);
          assignments.push({ url: assignmentUrl, type: type });
        }
      });
      return assignments;
    } catch (error) {
      console.error('Error getting course assignments:', error);
      throw error;
    }
  }
  updateDocument(userDocId: string, courseIndexToUpdate: number) {
    const completedValue = true; // Replace this with the new value for the 'completed' field

    // Get a reference to the document
    const docRef = this.firestore.collection('students').doc(userDocId);

    // Update the document
    docRef
      .get()
      .toPromise()
      .then((doc) => {
        if (doc && doc.exists) {
          const studentData = doc.data() as { courses: any[] }; // Type assertion
          const courses = studentData.courses || [];

          // Update the 'completed' field of the specified course
          if (courses.length > courseIndexToUpdate) {
            courses[courseIndexToUpdate].completed = completedValue;
          }

          // Update the 'courses' field in the document
          return docRef.update({ courses: courses });
        } else {
          throw new Error('Student document not found!');
        }
      })
      .then(() => {
        console.log('Student document successfully updated!');
      })
      .catch((error) => {
        console.error('Error updating student document: ', error);
      });
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
