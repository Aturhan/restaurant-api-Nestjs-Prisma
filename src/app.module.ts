import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

import { FoodsModule } from './foods/foods.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [DatabaseModule, UsersModule, OrdersModule, FoodsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
