export class DishDto {
	id: number;
	name: string;
	weight: number;
	desc: string;
	calories: number;
	price: number;
	// kitchen: KitchenDTO;
	image: string;
}

export class DishDtoOnLoad {
	data: DishDto;
}