export interface GetTemplates {
	name: string;
	uuid: string;
	category: string;
	description: string;
	template: string | null;
	tags: string[];
}
