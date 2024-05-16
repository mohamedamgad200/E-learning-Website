export interface AssignmentMetaData {
  id?: string; // Optional as it's assigned by Firestore
  name: string;
  url: string;
  size: number;
}
