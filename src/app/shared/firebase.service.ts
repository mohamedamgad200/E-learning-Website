import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FileMetaData } from '../model/file-meta-data';
import { FileService } from './file.service';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  Auth,
  UserCredential,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  orderBy,
  limit,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  successMessage = '';
  private firebaseConfig = {
    apiKey: 'AIzaSyCGyDldNOsvjhSoQV2CVxt7k6mViTrPKmA',
    authDomain: 'e-learning-d458c.firebaseapp.com',
    projectId: 'e-learning-d458c',
    storageBucket: 'e-learning-d458c.appspot.com',
    messagingSenderId: '762387785722',
    appId: '1:762387785722:web:eeec2a6892ea7f4cd86643',
    measurementId: 'G-9WYG7KQVZ9',
  };

  private firebaseApp = initializeApp(this.firebaseConfig);
  private analytics = getAnalytics(this.firebaseApp);
  private auth = getAuth();
  private firestore = getFirestore();
  userData: any;
  constructor(private fileService: FileService) {}
  async registerWithEmailAndPassword(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<void> {
    const { email, password, name } = userData;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      // Generate dynamic incremental ID
      const nextId = await this.getNextStudentId();

      // Save user data to Firestore with the generated ID
      await addDoc(collection(this.firestore, 'students'), {
        id: nextId,
        name,
        email,
        uid: userCredential.user.uid,
        isApproved: false,
        isActive: false,
        courses: [],
      });

      console.log('User registered successfully:', userCredential.user);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
  // async addCourseToStudent(
  //   studentId: number,
  //   courseName: string
  // ): Promise<void> {
  //   try {
  //     // Find the student by ID
  //     const { studentDocId, ...student } = await this.findStudentById(
  //       studentId
  //     );
  //     console.log(studentDocId, student);
  //     // Check if student exists
  //     if (student) {
  //       let updatedCourses: string[] = []; // Initialize updatedCourses as an empty array

  //       // Check if the student already has courses and if it's an array
  //       if (Array.isArray(student.courses)) {
  //         updatedCourses = [...student.courses, courseName]; // Add courseName to existing courses
  //       } else {
  //         updatedCourses = [courseName]; // Initialize courses array with courseName
  //       }
  //       console.log('allo 1');
  //       // Update the student's document with the new courses array
  //       await updateDoc(doc(this.firestore, `students/${studentDocId}`), {
  //         courses: updatedCourses,
  //       });
  //       console.log('allo 2');
  //       console.log('Course added to student successfully:', courseName);
  //     } else {
  //       console.error('Student not found');
  //     }
  //   } catch (error) {
  //     console.error('Error adding course to student:', error);
  //     throw error;
  //   }
  // }
  async addCourseToStudent(
    studentId: number,
    courseName: string
  ): Promise<void> {
    try {
      // Find the student by ID
      const { studentDocId, ...student } = await this.findStudentById(
        studentId
      );
      console.log(studentDocId, student);
      // Check if student exists
      if (student) {
        let updatedCourses: { name: string; completed: boolean }[] = []; // Initialize updatedCourses as an empty array of objects

        // Check if the student already has courses and if it's an array
        if (Array.isArray(student.courses)) {
          updatedCourses = [
            ...student.courses,
            { name: courseName, completed: false }, // Add object with courseName and completion status initially set to false
          ];
        } else {
          updatedCourses = [{ name: courseName, completed: false }]; // Initialize courses array with the new object
        }

        // Update the student's document with the new courses array
        await updateDoc(doc(this.firestore, `students/${studentDocId}`), {
          courses: updatedCourses,
        });

        console.log('Course added to student successfully:', courseName);
      } else {
        console.error('Student not found');
      }
    } catch (error) {
      console.error('Error adding course to student:', error);
      throw error;
    }
  }

  async findStudentById(studentId: number): Promise<any> {
    try {
      const studentsCollectionRef = collection(this.firestore, 'students');
      const querySnapshot = await getDocs(studentsCollectionRef);

      let studentDocId: string | null = null;

      querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        if (studentData && studentData['id'] === studentId) {
          studentDocId = doc.id;
        }
      });

      if (studentDocId) {
        const studentRef = doc(this.firestore, 'students', studentDocId);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          const studentData = studentSnap.data();
          console.log(studentDocId);
          return { studentDocId, ...studentData }; // Ensure to return the correct document ID
        } else {
          console.error('Student document found by ID but does not exist');
          return null;
        }
      } else {
        console.error('No student found with the provided ID.');
        return null;
      }
    } catch (error) {
      console.error('Error finding student by ID:', error);
      throw error;
    }
  }

  async getNextStudentId(): Promise<number> {
    try {
      const studentsCollectionRef = collection(this.firestore, 'students');
      const studentsQuery = query(
        studentsCollectionRef,
        orderBy('id', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(studentsQuery);

      if (!querySnapshot.empty) {
        const lastStudent = querySnapshot.docs[0].data();
        const lastStudentId = lastStudent['id'];
        return lastStudentId + 1;
      } else {
        return 4; // If no students found, start from ID 4
      }
    } catch (error) {
      console.error('Error fetching next student ID:', error);
      throw error;
    }
  }
  async registerInstructorWithEmailAndPassword(instructorData: {
    email: string;
    password: string;
    name: string;
  }): Promise<void> {
    const { email, password, name } = instructorData;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      await addDoc(collection(this.firestore, 'instructors'), {
        name,
        email,
        uid: userCredential.user.uid,
      });
      console.log('User registered successfully:', userCredential.user);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
  setUserData(userData: User | null, docID: string | null): void {
    this.userData = userData;
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('docID', docID as string); // Type assertion to assert that docID is not null
  }

  // Function to clear user data from local storage
  clearUserData(): void {
    this.userData = null;
    localStorage.removeItem('userData');
  }
  // Function to add a course to a student's array of courses
  // async loginWithEmailAndPassword(
  //   email: string,
  //   password: string
  // ): Promise<any> {
  //   try {
  //     // Sign in with email and password
  //     const userCredential = await signInWithEmailAndPassword(
  //       this.auth,
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;

  //     // Get the user document ID
  //     const userDocId = await this.getUserDocumentIdByUid(user.uid);

  //     if (userDocId) {
  //       // Construct the document reference properly
  //       const userDocRef = doc(
  //         collection(this.firestore, 'students'),
  //         userDocId
  //       );

  //       // Retrieve the user document
  //       const userDoc = await getDoc(userDocRef);

  //       // Check if the user document exists and if the user is active
  //       if (userDoc.exists()) {
  //         console.log('User logged in successfully');
  //         this.userData = userDoc.data();
  //         this.setUserData(this.userData);
  //         console.log(this.userData);
  //         return userDoc.data(); // Return the document data
  //       } else {
  //         console.error('User document does not exist');
  //         throw new Error('User document does not exist');
  //       }
  //     } else {
  //       console.error('No user document found with the provided UID.');
  //       throw new Error('No user document found with the provided UID.');
  //     }

  //     // Additional actions after login can be performed here
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //     throw error;
  //   }
  // }
  async loginWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<any> {
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get the user document ID
      const userDocId = await this.getUserDocumentIdByUid(user.uid);
      console.log(userDocId);
      if (userDocId) {
        // Construct the document reference properly
        const userDocRef = doc(
          collection(this.firestore, 'students'),
          userDocId
        );

        // Retrieve the user document
        const userDoc = await getDoc(userDocRef);

        // Check if the user document exists and if the user is active
        if (userDoc.exists()) {
          console.log('User logged in successfully');
          this.userData = userDoc.data();
          console.log(userDocId);
          this.setUserData(this.userData, userDocId); // Pass the docID to setUserData
          console.log(this.userData, userDocId);
          return { docID: userDocId, userData: userDoc.data() }; // Return the document ID and data
        } else {
          console.error('User document does not exist');
          throw new Error('User document does not exist');
        }
      } else {
        console.error('No user document found with the provided UID.');
        throw new Error('No user document found with the provided UID.');
      }

      // Additional actions after login can be performed here
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
  async loginInstructorWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<void> {
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get the user document ID
      const userDocId = await this.getInstructorDocumentIdByUid(user.uid);

      if (userDocId) {
        // Construct the document reference properly
        const userDocRef = doc(
          collection(this.firestore, 'instructors'),
          userDocId
        );

        // Retrieve the user document
        const userDoc = await getDoc(userDocRef);

        // Check if the user document exists and if the user is active
        if (userDoc.exists()) {
          console.log('login successful');
        } else {
          console.error('User document does not exist');
          throw new Error('User document does not exist');
        }
      } else {
        console.error('No user document found with the provided UID.');
        throw new Error('No user document found with the provided UID.');
      }

      // Additional actions after login can be performed here
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<any[]> {
    const users: any[] = [];
    const usersQuery = query(collection(this.firestore, 'students'));
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      users.push(user);
    });
    return users;
  }
  async getInstructorDocumentIdByUid(uid: string): Promise<string | null> {
    try {
      const usersQuery = query(
        collection(this.firestore, 'instructors'),
        where('uid', '==', uid)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        // If there's a document with the provided UID, return its ID
        return querySnapshot.docs[0].id;
      } else {
        console.log('No user found with the provided UID.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving user document ID by UID:', error);
      throw error;
    }
  }
  async getUserDocumentIdByUid(uid: string): Promise<string | null> {
    try {
      const usersQuery = query(
        collection(this.firestore, 'students'),
        where('uid', '==', uid)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        // If there's a document with the provided UID, return its ID
        return querySnapshot.docs[0].id;
      } else {
        console.log('No user found with the provided UID.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving user document ID by UID:', error);
      throw error;
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      const docid = await this.getUserDocumentIdByUid(uid); // Await the result
      if (docid) {
        const userDocRef = doc(this.firestore, 'students', docid);
        await deleteDoc(userDocRef);
        console.log('User account deleted successfully');
      } else {
        console.log('No user found with the provided UID.');
      }
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  }
  async deactivateAccount(uid: string): Promise<void> {
    try {
      const docid = await this.getUserDocumentIdByUid(uid); // Await the result
      if (docid) {
        const userDocRef = doc(this.firestore, 'students', docid);
        await updateDoc(userDocRef, { isActive: false }); // Update isActive field to false
        console.log('User account deactivated successfully');
      } else {
        console.log('No user found with the provided UID.');
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw error;
    }
  }

  async activateUser(uid: string): Promise<void> {
    try {
      const docid = await this.getUserDocumentIdByUid(uid); // Await the result
      if (docid) {
        const userDocRef = doc(this.firestore, 'students', docid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          await updateDoc(userDocRef, { isActive: true }); // Update isActive field to true
          console.log('User account activated successfully');
        } else {
          throw new Error('User document does not exist');
        }
      } else {
        console.log('No user found with the provided UID.');
      }
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }
}
