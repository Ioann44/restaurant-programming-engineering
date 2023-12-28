import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientDto, ClientSuppressedDto, RolesEnum, UserReturnedDto } from "./auth.dto";
import { ClientEntity } from "./auth.entity";

@Injectable()
export class ClientAuthService {
	constructor(
		@InjectRepository(ClientEntity) private readonly clientRep: Repository<ClientEntity>,
		private jwtService: JwtService
	) { }

	async login(input: ClientDto): Promise<UserReturnedDto> {
		const user = await this.clientRep.findOne({ where: { email: input.email } });
		if (user && await bcrypt.compare(input.password, user.password)) {
			const { password, ...userShrinked } = { ...user };
			return { token: await this.generateToken(user), user: { ...userShrinked, role: RolesEnum.Client } as any };
		}
		throw new UnauthorizedException({ message: "Некорректный емайл или пароль" })
	}

	async register(input: ClientSuppressedDto): Promise<UserReturnedDto> {
		const { id, ...dtoNoId } = { ...input };
		const candidate = await this.clientRep.findOne({ where: { email: input.email } });
		if (candidate) {
			throw new ConflictException("Этот логин уже занят");
		}
		const hashPassword = await bcrypt.hash(input.password, 5);
		const user = await this.clientRep.save({ ...dtoNoId, password: hashPassword });
		const { password, ...userShrinked } = { ...user };
		return { token: await this.generateToken(user), user: { ...userShrinked, role: RolesEnum.Client } as any };
	}

	async getOne(id: number): Promise<ClientEntity> {
		return this.clientRep.findOne({ where: { id } });
	}

	async getAll(): Promise<ClientEntity[]> {
		return this.clientRep.find();
	}

	async update(input: ClientDto): Promise<ClientEntity> {
		const { deliveries, reservations, email, ...inputShrinked } = { ...input };
		if (input.password) {
			inputShrinked.password = await bcrypt.hash(input.password, 5);
		}
		const saved = await this.clientRep.update(input.id, inputShrinked);
		return this.clientRep.findOne({ where: { id: input.id } });
	};

	async delete(id: number): Promise<number> {
		await this.clientRep.delete({ id });
		return id;
	}

	private async generateToken(user: ClientEntity): Promise<string> {
		const payload = { id: user.id, email: user.email, role: RolesEnum.Client };
		return this.jwtService.signAsync(payload);
	}
}