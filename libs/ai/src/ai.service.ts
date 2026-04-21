import Anthropic from "@anthropic-ai/sdk";
import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

export interface AiMessage {
	role: "user" | "assistant";
	content: string;
}

type Provider = "anthropic" | "openai";

const DEFAULTS: Record<Provider, string> = {
	anthropic: "claude-sonnet-4-6",
	openai: "gpt-4o",
};

@Injectable()
export class AiService implements OnModuleInit {
	constructor(private readonly configService: ConfigService) {}

	private readonly logger = new Logger(AiService.name);
	private provider: Provider;
	private anthropic: Anthropic | null = null;
	private openai: OpenAI | null = null;

	onModuleInit() {
		const claudeApiKey = this.configService.getOrThrow("ANTHROPIC_API_KEY");

		if (claudeApiKey) {
			this.provider = "anthropic";
			this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
		} else if (process.env.OPENAI_API_KEY) {
			this.provider = "openai";
			this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		} else {
			throw new Error(
				"No AI provider configured: set ANTHROPIC_API_KEY or OPENAI_API_KEY",
			);
		}
		this.logger.log(`Using AI provider: ${this.provider}`);
	}

	async createMessage(
		messages: AiMessage[],
		options: { system?: string; model?: string } = {},
	): Promise<string> {
		const model = options.model ?? DEFAULTS[this.provider];

		if (this.anthropic) {
			const response = await this.anthropic.messages.create({
				model,
				max_tokens: 8096,
				system: options.system,
				messages,
			});
			const block = response.content[0];
			return block.type === "text" ? block.text : "";
		}

		if (this.openai) {
			const response = await this.openai.chat.completions.create({
				model,
				messages: [
					...(options.system
						? [{ role: "system" as const, content: options.system }]
						: []),
					...messages,
				],
			});
			return response.choices[0]?.message?.content ?? "";
		}

		throw new Error("No AI provider initialized");
	}
}
