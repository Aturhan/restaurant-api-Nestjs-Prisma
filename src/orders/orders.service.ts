import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserDto } from './dto/user.dto';
import { CreateOrderResponseDto, OrderDetailsDto, Response } from './dto/create-order-response.dto';






@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService){}



 async create(createOrderDto: CreateOrderDto) {
      const { userId, orderItems } = createOrderDto;

      const items = [];


      for (const orderItem of orderItems) {

        const food = await this.databaseService.food.findUnique({where: {id: orderItem.foodId}})
        if(food && food.availability === "IN_STORE") {
          const createdOrderItem = await this.databaseService.orderItem.create({
            data: {
                foodId: orderItem.foodId,
                quantity: orderItem.quantity
            }
        });
        items.push(createdOrderItem);
      
        }
        
      }


      const totalPrice = this.calculateTotalPrice(items);

      // const items = orderItems.map(async (orderItem) => {
          
      //        return await this.databaseService.orderItem.create({
      //           data: {
      //             foodId: orderItem.foodId,
      //             quantity: orderItem.quantity
      //           }
      //         });
            
      // });

      const createdItems = await Promise.all(items);

     

      const orderItemInputs = createdItems.map(item => ({ foodId: item.foodId, quantity: item.quantity }));

     const savedOrder = await this.databaseService.order.create({
         data: {
            userId: userId,
            totalPrice: await totalPrice,
            orderItems: {
                create: orderItemInputs
    }
  }
})

    const user = await this.databaseService.user.findUnique({where: {id: savedOrder.userId}})
    const userDto = new UserDto();
    userDto.name = user.name
    userDto.id = user.id
    userDto.email = user.email
    userDto.address = user.address

    const orderDetails = new OrderDetailsDto()

    orderDetails.orderId = savedOrder.id
    orderDetails.creteadAt = savedOrder.createdAt
    orderDetails.totalPrice = savedOrder.totalPrice

    const createOrderResponse = new CreateOrderResponseDto()

    createOrderResponse .user = userDto
    createOrderResponse .orderDetails = orderDetails
    createOrderResponse .orders = orderItems

    const response = new Response()
    response.data = createOrderResponse
    response.message = "Order created successfully"
    response.success = true

    return response

}


 private async calculateTotalPrice(orderItems: { foodId: string, quantity: number }[]): Promise<number> {
      let totalPrice = 0;

      for(const orderItem of orderItems) {
        const food = await this.databaseService.food.findUnique({where: {id: orderItem.foodId}})
        totalPrice += orderItem.quantity * food.price
      }

        return totalPrice;
}



 async findAll() {
    const orders = await this.databaseService.order.findMany({})
    if(orders.length > 0) return orders
    throw new NotFoundException(`No records found!`)
  }

 async findOne(id: string) {
   const  order = await this.databaseService.order.findUnique({where: {id}})
   if(!order) throw new NotFoundException(`Order ${id} not found`)
   return order
  }

 async update(id: string, updateOrderDto: Prisma.OrderUpdateInput) {
    const order = await this.databaseService.order.findUnique({where: {id}})
    if(!order) throw new NotFoundException(`Order ${id} not found`)
    return this.databaseService.order.update({
  where: {
    id: order.id,
  },data: updateOrderDto})
      
  }

  async remove(id: string) {
    const order = await this.databaseService.order.findUnique({where: {id}})
    if(!order) throw new NotFoundException(`Order ${id} not found`)
    return this.databaseService.order.delete({where: {id: order.id}});
  }

} 
