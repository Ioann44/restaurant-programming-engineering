import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { KitchenEntity } from "./kitchen.entity";

@Injectable()
export class KitchenService {
    constructor(
        @InjectRepository(KitchenEntity) private readonly kitchenRep: Repository<KitchenEntity>
    ) { }

    async getAll(): Promise<KitchenEntity[]> {
        return this.kitchenRep.find();
    }

    async getOne(id: number): Promise<KitchenEntity> {
        return this.kitchenRep.findOne({ where: { id } });
    }

    async insertOne(input: KitchenEntity): Promise<KitchenEntity> {
        delete input.id;
        const saved = await this.kitchenRep.save(input);
        return this.getOne(saved.id);
    }

    async update(input: KitchenEntity): Promise<KitchenEntity> {
        await this.kitchenRep.update(input.id, input);
        return this.getOne(input.id);
    };

    async deleteOne(id: number): Promise<number> {
        await this.kitchenRep.delete({ id });
        return id;
    }
}
