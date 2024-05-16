export interface AssignmentStudentMetaData {
  id?: string;
  name: string;
  url: string;
  size: number;
  studentName: string; // New field for student name
  studentId: string; // New field for student ID
  grade?: number;
  courseName: string;
}
