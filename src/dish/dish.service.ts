import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DishEntity } from "./dish.entity";
import { Repository } from "typeorm";
import { DishDto } from "./dish.dto";

@Injectable()
export default class DishService {
    constructor(
        @InjectRepository(DishEntity) private readonly dishRep: Repository<DishEntity>,
    ) { }

    async getAll(): Promise<DishEntity[]> {
        return this.dishRep.find();
    }

    async insertOne(input: DishDto): Promise<DishEntity> {
        const { id, ...inputWithoutId } = { ...input };
        const saved = await this.dishRep.save(inputWithoutId);
        return this.dishRep.findOne({ where: { id: saved.id } }); // add relation
    }

    async update(input: DishDto): Promise<DishEntity> {
        const saved = await this.dishRep.update(input.id, input);
        return this.dishRep.findOne({ where: { id: input.id } });
    };

    async deleteOne(id: number): Promise<number> {
        // var wtsObject = await this.dishRep.findOne({ where: { id }}); // add relation
        // also remove connected file
        await this.dishRep.delete({ id });
        return id;
    }
}
