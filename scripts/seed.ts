import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
	adapter: new PrismaPg(process.env.DATABASE_URL!),
});

async function main() {
	await prisma.candidateScore.deleteMany();
	await prisma.candidate.deleteMany();
	await prisma.job.deleteMany();
	await prisma.template.deleteMany();

	const engineeringTemplate = await prisma.template.create({
		data: {
			name: "Software Engineer",
			jobDescription: `## Role Overview
{{role_overview}}

## Responsibilities
{{responsibilities}}

## Requirements
{{requirements}}

## Nice to Have
{{nice_to_have}}`,
			category: "Engineering",
			tags: ["react", "typescript", "frontend"],
		},
	});

	const productTemplate = await prisma.template.create({
		data: {
			name: "Product Manager",
			jobDescription: `## Role Overview
{{role_overview}}

## Responsibilities
{{responsibilities}}

## Requirements
{{requirements}}

## What We Offer
{{what_we_offer}}`,
			category: "Product",
			tags: ["product-management", "growth", "analytics"],
		},
	});

	const seniorFrontend = await prisma.job.create({
		data: {
			title: "Senior Frontend Engineer",
			department: "Engineering",
			status: "ACTIVE",
			templateId: engineeringTemplate.id,
			notes:
				"Looking for someone with strong React and TypeScript skills. Team is 6 engineers. Need to lead the design system work.",
			content: `## Senior Frontend Engineer

We are looking for a Senior Frontend Engineer to join our growing engineering team.

### Responsibilities
- Lead development of our React-based design system
- Mentor junior engineers and conduct code reviews
- Collaborate with product and design to deliver high-quality features

### Requirements
- 5+ years of frontend development experience
- Expert-level React and TypeScript
- Experience with component libraries and design systems
- Strong understanding of web performance

### Nice to Have
- Experience with Next.js
- Familiarity with Figma`,
		},
	});

	const backendJob = await prisma.job.create({
		data: {
			title: "Backend Engineer",
			department: "Engineering",
			status: "ACTIVE",
			templateId: engineeringTemplate.id,
			notes:
				"NestJS and PostgreSQL stack. Need someone comfortable with distributed systems.",
			content: `## Backend Engineer

Join our backend team building the core infrastructure for our platform.

### Responsibilities
- Design and build scalable REST APIs with NestJS
- Optimize database queries and schema design
- Participate in on-call rotation

### Requirements
- 3+ years of backend development
- Strong Node.js and TypeScript skills
- Experience with PostgreSQL and ORMs
- Understanding of REST API design

### Nice to Have
- Experience with message queues (Kafka, RabbitMQ)
- Kubernetes and Docker experience`,
		},
	});

	const closedJob = await prisma.job.create({
		data: {
			title: "Product Manager – Growth",
			department: "Product",
			status: "CLOSED",
			templateId: productTemplate.id,
			notes: "Position filled internally.",
			content: `## Product Manager – Growth

Drive growth initiatives across our product suite.

### Responsibilities
- Own the growth roadmap and experimentation pipeline
- Work with data and engineering to ship A/B tests

### Requirements
- 4+ years in product management
- Strong analytical skills and SQL proficiency`,
		},
	});

	const alice = await prisma.candidate.create({
		data: {
			name: "Alice Chen",
			jobId: seniorFrontend.id,
			cvText: `Alice Chen — Senior Frontend Engineer
5 years experience at Shopify and Vercel. Expert in React, TypeScript, and Next.js.
Led migration of Shopify's checkout UI to a new component system used by 1M+ merchants.
Open source contributor to Radix UI. B.Sc. Computer Science, UBC.`,
		},
	});

	const bob = await prisma.candidate.create({
		data: {
			name: "Bob Martinez",
			jobId: seniorFrontend.id,
			cvText: `Bob Martinez — Frontend Developer
3 years experience at a B2B SaaS startup. Works with React and Vue.
Built internal design system from scratch. Comfortable with CSS-in-JS and Tailwind.
Self-taught, no degree. Strong portfolio of side projects.`,
		},
	});

	const carol = await prisma.candidate.create({
		data: {
			name: "Carol Kim",
			jobId: backendJob.id,
			cvText: `Carol Kim — Backend Engineer
4 years at fintech companies. Node.js, NestJS, PostgreSQL, Redis.
Designed event-driven architecture handling 50k transactions/day.
M.Sc. Computer Science, Seoul National University.`,
		},
	});

	const dave = await prisma.candidate.create({
		data: {
			name: "Dave Okafor",
			jobId: backendJob.id,
			cvText: `Dave Okafor — Software Engineer
6 years experience across full stack. Primarily Python and Django, some Node.
Switched to TypeScript 1 year ago. No NestJS experience but familiar with Express.
B.Eng. Software Engineering, University of Lagos.`,
		},
	});

	await prisma.candidateScore.create({
		data: {
			candidateId: alice.id,
			overall: 92,
			skillsMatch: 95,
			experience: 90,
			cultureFit: 88,
			summary:
				"Exceptional candidate with directly relevant experience building design systems at scale. Strong open source track record. Likely to ramp up quickly and lead independently.",
			pros: [
				"Led large-scale component system migration at Shopify",
				"Expert React and TypeScript",
				"Active open source contributor",
				"Next.js experience is a bonus",
			],
			cons: [
				"May be over-qualified for parts of the role",
				"Salary expectations might be above range",
			],
		},
	});

	await prisma.candidateScore.create({
		data: {
			candidateId: bob.id,
			overall: 64,
			skillsMatch: 60,
			experience: 58,
			cultureFit: 80,
			summary:
				"Solid developer with relevant frontend skills but lacks the seniority level and scale of experience required. Strong portfolio shows initiative. Better fit for a mid-level role.",
			pros: [
				"Built a design system independently",
				"Good cultural fit based on background",
				"Shows strong self-motivation",
			],
			cons: [
				"Only 3 years experience vs 5+ required",
				"No experience at scale",
				"Vue background may indicate limited React depth",
			],
		},
	});

	await prisma.candidateScore.create({
		data: {
			candidateId: carol.id,
			overall: 88,
			skillsMatch: 92,
			experience: 85,
			cultureFit: 85,
			summary:
				"Strong backend candidate with hands-on NestJS and PostgreSQL experience in a demanding fintech environment. Event-driven architecture experience is highly relevant.",
			pros: [
				"Direct NestJS and PostgreSQL experience",
				"Proven at scale in fintech",
				"Distributed systems knowledge",
			],
			cons: [
				"4 years experience is slightly below ideal",
				"No Kubernetes mentioned",
			],
		},
	});

	await prisma.candidateScore.create({
		data: {
			candidateId: dave.id,
			overall: 55,
			skillsMatch: 48,
			experience: 65,
			cultureFit: 72,
			summary:
				"Experienced engineer but primary stack (Python/Django) doesn't align with the role. Only 1 year TypeScript experience and no NestJS is a significant gap for a team looking to move fast.",
			pros: [
				"6 years overall engineering experience",
				"Full-stack exposure could be useful",
			],
			cons: [
				"Primary stack is Python, not Node.js",
				"No NestJS experience",
				"Only 1 year TypeScript",
				"Would require significant ramp-up time",
			],
		},
	});

	console.log("Seeded:");
	console.log(`  2 templates`);
	console.log(`  3 jobs (2 active, 1 closed)`);
	console.log(`  4 candidates`);
	console.log(`  4 candidate scores`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
