import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientDto, ClientSuppressedDto, RolesEnum } from "./auth.dto";
import { ClientEntity } from "./auth.entity";

@Injectable()
export class ClientAuthService {
	constructor(
		@InjectRepository(ClientEntity) private readonly clientRep: Repository<ClientEntity>,
		private jwtService: JwtService
	) { }

	async login(input: ClientDto): Promise<Object> {
		const user = await this.clientRep.findOne({ where: { email: input.email } });
		const passwordEquals = await bcrypt.compare(input.password, user.password);
		if (user && passwordEquals) {
			return this.generateToken(user);
		}
		throw new UnauthorizedException({ message: "Некорректный емайл или пароль" })
	}

	async register(input: ClientSuppressedDto): Promise<Object> {
		const { id, ...dtoNoId } = { ...input };
		const candidate = await this.clientRep.findOne({ where: { email: input.email } });
		if (candidate) {
			throw new ConflictException("Этот логин уже занят");
		}
		const hashPassword = await bcrypt.hash(input.password, 5);
		const user = await this.clientRep.save({ ...dtoNoId, password: hashPassword });
		return this.generateToken(user)
	}

	async getAll(): Promise<ClientEntity[]> {
		return this.clientRep.find();
	}

	async update(input: ClientDto): Promise<ClientEntity> {
		const { deliveries, reservations, password, ...inputShrinked } = { ...input };
		const saved = await this.clientRep.update(input.id, inputShrinked);
		return this.clientRep.findOne({ where: { id: input.id } });
	};

	async delete(id: number): Promise<number> {
		await this.clientRep.delete({ id });
		return id;
	}

	private async generateToken(user: ClientEntity): Promise<Object> {
		const payload = { id: user.id, email: user.email, role: RolesEnum.Client };
		return {
			token: await this.jwtService.signAsync(payload)
		};
	}
}