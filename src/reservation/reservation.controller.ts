import { Body, Controller, Get, Patch, Put, Req, UseGuards } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { RolesEnum } from "src/auth/auth.dto";
import { JwtAuthGuard, Roles, TokenParser } from "src/auth/jwt-auth.guard";
import { ReservationDto } from "./reservation.dto";

@Controller("reservations/")
export class ReservationController {
	constructor(
		private readonly reservationService: ReservationService,
		private readonly tokenParser: TokenParser
	) { }

	@Get("all")
	@UseGuards(JwtAuthGuard)
	@Roles(RolesEnum.Admin, RolesEnum.Manager, RolesEnum.Courier)
	async getAll() {
		return this.reservationService.getAll();
	}

	@Get("by-user")
	@UseGuards(JwtAuthGuard)
	@Roles(RolesEnum.Client)
	async getOfUser(@Req() req) {
		const tokenData = this.tokenParser.parse(req);
		return this.reservationService.getAllOfUser((await tokenData).id);
	}

	@Put()
	@UseGuards(JwtAuthGuard)
	@Roles(RolesEnum.Client, RolesEnum.Manager)
	async create(@Body() input: ReservationDto, @Req() req): Promise<ReservationDto> {
		const tokenPayload = await this.tokenParser.parse(req);
		if (tokenPayload.role == RolesEnum.Client) {
			input.client = { id: tokenPayload.id } as any;
		}
		// change line below to normal dto with excluded password hashed etc
		return this.reservationService.create(input) as any;
	}

	@Patch()
	@UseGuards(JwtAuthGuard)
	@Roles(RolesEnum.Admin, RolesEnum.Manager, RolesEnum.Courier)
	async update(@Body() input: ReservationDto): Promise<ReservationDto> {
		return this.reservationService.update(input) as any;
	}
}