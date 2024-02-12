
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, ValidateNested } from "class-validator";

export class OrderItemDto {
    @IsNotEmpty()
    foodId: string;
  
    @IsNotEmpty()
    quantity: number;
  }
  
  export class CreateOrderDto {
    @IsNotEmpty()
    userId: string;
  
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @ArrayUnique((item: OrderItemDto) => item.foodId)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];
  }