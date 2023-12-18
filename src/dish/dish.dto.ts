import { FileEntity } from "src/file/file.entity";

export class DishPublicDto {
	id: number;
	name: string;
	weight: number;
	desc: string;
	calories: number;
	price: number;
	// kitchen: KitchenDTO;
	image: string;
}

export class DishAdminDto {
	id: number;
	name: string;
	weight: number;
	desc: string;
	calories: number;
	price: number;
	// kitchen: KitchenDTO;
	image: FileEntity;
}

export class DishAdminDtoOnLoad {
	data: DishAdminDto;
}