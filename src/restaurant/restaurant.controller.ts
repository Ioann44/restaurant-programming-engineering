import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { DateDto, RestaurantDto, TableDto } from './restaurant.dto';
import { DishService } from 'src/dish/dish.service';
import { ReservationService } from 'src/reservation/reservation.service';
import { RestaurantEntity } from './restaurant.entity';
import { JwtAuthGuard, Roles } from 'src/auth/jwt-auth.guard';
import { RolesEnum } from 'src/auth/auth.dto';

@Controller('restaurant/')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly dishService: DishService,
    private readonly reservationsService: ReservationService,
  ) {}

  @Get('')
  async getAll(@Body() input: DateDto): Promise<RestaurantDto[]> {
    console.log(input);

    const usedTables = !('date' in input)
      ? new Set([] as number[])
      : await this.reservationsService.getTablesOnDate(input.date);
    let restaurants = await this.restaurantService.getAll();
    for (const item of restaurants) {
      let tables: TableDto[] = [];
      for (let i = 0; i < item.tables.length; i++) {
        tables.push({
          id: i,
          capacity: item.tables[i],
          used: usedTables.has(i),
        });
      }
      item.tables = tables as any;

      item.menu = item.menu.map((item) =>
        this.dishService.entityToDto(item),
      ) as any;
      (item as any).freePlaces = (item.tables as any)
        .filter((item: TableDto) => !item.used)
        .reduce((sum: number, item: TableDto) => sum + item.capacity, 0);
    }
    return restaurants as any;
  }

  @Get('one/:id')
  async getOne(
    @Param('id') id: number,
    @Body() input: DateDto,
  ): Promise<RestaurantDto> {
    const usedTables = !('date' in input)
      ? new Set([])
      : await this.reservationsService.getTablesOnDate(input.date);
    let restaurant = await this.restaurantService.getOne(id);
    let tables: TableDto[] = [];
    for (let i = 0; i < restaurant.tables.length; i++) {
      tables.push({
        id: i,
        capacity: restaurant.tables[i],
        used: usedTables.has(i),
      });
    }
    const menu = restaurant.menu.map((item) =>
      this.dishService.entityToDto(item),
    );
    const freePlaces = tables
      .filter((item: TableDto) => !item.used)
      .reduce((sum: number, item: TableDto) => sum + item.capacity, 0);
    return { ...restaurant, tables, menu, freePlaces };
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(JwtAuthGuard)
  @Put()
  async insert(@Body() input: RestaurantEntity): Promise<RestaurantDto> {
    const saved = await this.restaurantService.insert(input);
    return this.getOne(saved.id, {} as any);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() input: RestaurantEntity): Promise<RestaurantDto> {
    const updated = await this.restaurantService.update(input);
    return this.getOne(updated.id, {} as any);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<number> {
    return this.restaurantService.delete(id);
  }
}
