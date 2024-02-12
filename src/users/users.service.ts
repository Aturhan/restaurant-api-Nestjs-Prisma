import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService){}


  // async create(createUserDto: Prisma.UserCreateInput) {
  //   return this.databaseService.user.create({data: createUserDto});
  // }

 async findAll() {
    const users = await this.databaseService.user.findMany({});
    if(users.length > 0) return users
    throw new NotFoundException("No users found")
  }

 async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({where: {id}});
    if(user) return user;
    throw new NotFoundException(`User ${id} not found`)
  }

 async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    const user = await this.findOne(id)
    if(user){
      return this.databaseService.user.update({
        where: {
          id,
        },
        data: updateUserDto
      });

  }
  throw new NotFoundException(`User ${id} not found`)
 }

 async remove(id: string) {
  const user = await this.findOne(id)
  if(user){
    return this.databaseService.user.delete({where: {id}});;
  }
  throw new NotFoundException(`User ${id} not found`)
}
}