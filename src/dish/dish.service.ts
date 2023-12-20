import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DishEntity } from "./dish.entity";
import { Repository } from "typeorm";
import { FileService } from "src/file/file.service";

@Injectable()
export class DishService {
    constructor(
        @InjectRepository(DishEntity) private readonly dishRep: Repository<DishEntity>,
        private readonly fileService: FileService
    ) { }

    async getAll(): Promise<DishEntity[]> {
        return this.dishRep.find({ relations: { image: true } });
    }

    async getOne(id: number): Promise<DishEntity> {
        return this.dishRep.findOne({ where: { id }, relations: { image: true } });
    }

    async insertOne(input: DishEntity): Promise<DishEntity> {
        const { id, ...inputWithoutId } = { ...input };
        const saved = await this.dishRep.save(inputWithoutId);
        return this.dishRep.findOne({ where: { id: saved.id }, relations: { image: true } });
    }

    async update(input: DishEntity): Promise<DishEntity> {
        var oldItem = await this.dishRep.findOne({ where: { id: input.id }, relations: { image: true } });
        if (oldItem) {
            const oldImage = oldItem.image;
            await this.dishRep.update(input.id, input);
            if (input.image) {
                if (oldItem.image) {
                    await this.fileService.removeFile(oldItem.image.id);
                }
            }
        }
        return this.dishRep.findOne({ where: { id: input.id }, relations: { image: true } });
    };

    async deleteOne(id: number): Promise<number> {
        var item = await this.dishRep.findOne({ where: { id }, relations: { image: true } });
        if (item) {
            if (item.image) {
                await this.fileService.removeFile(item.image.id);
            }
            await this.dishRep.delete({ id });
        }
        return id;
    }
}
