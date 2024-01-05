export enum DishCategory {
	Drinks,
	Fastfood,
	FirstCourse,
	SecondCourse
}

export class DishDto {
	id: number;
	name: string;
	weight: number;
	kitchen: number;
	category: DishCategory;
	desc: string;
	calories: number;
	price: number;
	image: string;
}

export class DishDtoOnLoad {
	data: DishDto;
}