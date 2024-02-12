import { Controller, Get, Body, Patch, Param, Delete, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthhorizationGuard } from 'src/auth/authorization.guard';
import { HasRole } from 'src/decorators/roles-decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @UsePipes(ValidationPipe)
  // create(@Body() createUserDto: Prisma.UserCreateInput) {
  //   return this.usersService.create(createUserDto);
  // }

  @UseGuards(AuthhorizationGuard)
  @HasRole('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
