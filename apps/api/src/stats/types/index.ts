export interface RecentJob {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  candidateCount: number;
}

export interface GetStats {
  activeJobs: number;
  templates: number;
  candidates: number;
  avgScore: number | null;
  recentJobs: RecentJob[];
}
