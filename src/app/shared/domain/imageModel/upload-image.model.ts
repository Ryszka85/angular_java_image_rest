export class UploadImageModel {
  userId: string;
  file: FormData;
  status?: boolean;
  isPublic?: string;
  urlReference?: string;
  orgFile?: File;
}
