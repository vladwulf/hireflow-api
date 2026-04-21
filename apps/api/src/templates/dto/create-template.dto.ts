export class TemplateSection {
	title: string;
	placeholder: string;
}

export class CreateTemplateDto {
	name: string;
	description?: string;
	sections: TemplateSection[];
}
