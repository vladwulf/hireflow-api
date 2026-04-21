import { JobStatus } from "generated/prisma/enums";


export interface GetJob {
	id: string;
	title: string;
	category: string;
	status: JobStatus;
	content: string;
	templateId: number;
	createdAt: Date;
	updatedAt: Date;
}
