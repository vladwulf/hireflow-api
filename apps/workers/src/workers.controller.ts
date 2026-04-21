import { Controller, Get } from "@nestjs/common";
import type { WorkersService } from "./workers.service";

@Controller()
export class WorkersController {
	constructor(private readonly workersService: WorkersService) {}

	@Get()
	getHello(): string {
		return this.workersService.getHello();
	}
}
