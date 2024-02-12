import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { Prisma } from '@prisma/client';
import { SearchFoodName } from './dto/search-food-name.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { HasRole} from 'src/decorators/roles-decorator';
import { AuthhorizationGuard } from 'src/auth/authorization.guard';


@UseGuards(JwtAuthGuard)
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}
  
  @UseGuards(AuthhorizationGuard)
  @HasRole('ADMIN')
  @Post() 
  @UsePipes(ValidationPipe)
  create(@Body() createFoodDto: Prisma.FoodCreateInput) {
    return this.foodsService.create(createFoodDto);
  }
  
  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @UseGuards(AuthhorizationGuard)
  @HasRole('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(id);
  }

  @Get('/name')
  findByName(@Body() searchFoodName: SearchFoodName) {
    return this.foodsService.findByName(searchFoodName);
  }

  @UseGuards(AuthhorizationGuard)
  @HasRole('ADMIN')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateFoodDto: Prisma.FoodUpdateInput) {
    return this.foodsService.update(id, updateFoodDto);
  }

  @UseGuards(AuthhorizationGuard)
  @HasRole('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodsService.remove(id);
  }
}
