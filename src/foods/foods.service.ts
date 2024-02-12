import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { SearchFoodName } from './dto/search-food-name.dto';



@Injectable()
export class FoodsService {
    constructor(private readonly databaseService: DatabaseService){}


  async create(createFoodDto: Prisma.FoodCreateInput) {
    return this.databaseService.food.create({
      data: createFoodDto
    });
  }

 async findAll() {
    const foods = await this.databaseService.food.findMany({});
    if(foods.length > 0 ) return foods
    throw new NotFoundException("No record found!")
  }

  async findByName(searchFoodName: SearchFoodName) {
    const food = await this.databaseService.food.findUnique({where: {name: searchFoodName.name}})

    if(food) return food
    throw new NotFoundException(`Food ${searchFoodName.name} not found`)
  }

  async findOne(id: string) {
    const food = await this.databaseService.food.findUnique({
      where:{
        id,
      }
    });

    if(food) return food;
    
    throw new NotFoundException(`Food ${id} not found`)
  }

 async update(id: string, updateFoodDto: Prisma.FoodUpdateInput) {
    const food = await this.findOne(id)
    if(food){
       return this.databaseService.food.update({
          where: {
            id: food.id,
          },
            data: updateFoodDto
        });
    }
    throw new NotFoundException(`food ${id} not found`)
  }

 async remove(id: string) {
    const food = await this.findOne(id)
    if(food){
        return this.databaseService.food.delete({
            where:{
              id:food.id,
            }
          });
    }
    throw new NotFoundException(`food ${id} not found`)
}

}
