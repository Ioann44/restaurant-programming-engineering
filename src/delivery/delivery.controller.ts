import { Body, Controller, Get, Patch, Put, Req, UseGuards } from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { DeliveryDto } from "./delivery.dto";
import { JwtAuthGuard, Roles, TokenParser } from "src/auth/jwt-auth.guard";
import { RolesEnum } from "src/auth/auth.dto";

@Controller("delivery/")
export class DeliveryController {
	constructor(
		private readonly deliveryService: DeliveryService,
		private readonly tokenParser: TokenParser
	) { }

	@Get("all")
	@UseGuards(JwtAuthGuard)
	@Roles(RolesEnum.Admin, RolesEnum.Manager, RolesEnum.Courier)
	async getAll() {
		return this.deliveryService.getAll();
	}

	@Get("by-user")
	@UseGuards(JwtAuthGuard)
	@Roles(RolesEnum.Client)
	async getOfUser(@Req() req) {
		const tokenData = this.tokenParser.parse(req);
		return this.deliveryService.getAllOfUser((await tokenData).id);
	}

	@Put()
	@UseGuards(JwtAuthGuard)
	@Roles(RolesEnum.Client, RolesEnum.Manager)
	async create(@Body() input: DeliveryDto, @Req() req): Promise<DeliveryDto> {
		const tokenPayload = await this.tokenParser.parse(req);
		if (tokenPayload.role == RolesEnum.Client) {
			input.client = { id: tokenPayload.id } as any;
		}
		// change line below to normal dto with excluded password hashed etc
		return this.deliveryService.create(input) as any;
	}

	@Patch()
	@UseGuards(JwtAuthGuard)
	@Roles(RolesEnum.Admin, RolesEnum.Manager, RolesEnum.Courier)
	async update(@Body() input: DeliveryDto): Promise<DeliveryDto> {
		return this.deliveryService.update(input) as any;
	}
}