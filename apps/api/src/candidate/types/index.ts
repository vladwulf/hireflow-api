export interface GetCandidateScore {
	id: number;
	overall: number;
	skillsMatch: number;
	experience: number;
	cultureFit: number;
	summary: string;
	pros: string[];
	cons: string[];
	candidateId: number;
	createdAt: Date;
}

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
	score: GetCandidateScore | null;
}
