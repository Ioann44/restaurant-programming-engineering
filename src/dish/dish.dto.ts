export enum DishCategory {
	Drinks,
	Fastfood,
	Italian,
	Russian
}

export class DishDto {
	id: number;
	name: string;
	weight: number;
	category: DishCategory;
	desc: string;
	calories: number;
	price: number;
	image: string;
}

export class DishDtoOnLoad {
	data: DishDto;
}