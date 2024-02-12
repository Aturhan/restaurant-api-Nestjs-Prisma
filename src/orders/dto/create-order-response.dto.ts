
import { OrderItemDto } from "./create-order.dto";
import { UserDto } from "./user.dto"



export class Response {
    message: string
    success: boolean
    data: any
}

export class CreateOrderResponseDto {
    orderDetails: OrderDetailsDto
    user: UserDto
    orders: OrderItemDto[]
}

export class OrderDetailsDto {
    orderId: string
    totalPrice: number
    creteadAt: Date

}