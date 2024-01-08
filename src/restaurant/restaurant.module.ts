import { Module, forwardRef } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DishModule } from 'src/dish/dish.module';
import { ReservationModule } from 'src/reservation/reservation.module';

@Module({
	controllers: [RestaurantController],
	providers: [RestaurantService],
	imports: [
		TypeOrmModule.forFeature([RestaurantEntity]),
		forwardRef(() => AuthModule),
		DishModule,
		ReservationModule
	],
	exports: [RestaurantService]
})
export class RestaurantModule { }
