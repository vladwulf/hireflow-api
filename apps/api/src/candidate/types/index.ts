export interface GetCandidate {
  id: number;
  uuid: string;
  name: string;
  cvText: string;
  appFormText: string | null;
  extraText: string | null;
  jobId: number;
  createdAt: Date;
  updatedAt: Date;
}
