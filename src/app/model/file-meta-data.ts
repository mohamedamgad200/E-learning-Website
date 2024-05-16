export class FileMetaData {
  id: string = '';
  name: string = '';
  size: number = 0;
  file: File;
  url: string = '';
  fileId: string = ''; // Initialize fileId in the constructor

  constructor(file: File) {
    this.file = file;
  }
}
