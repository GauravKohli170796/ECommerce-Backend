import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { ORDER_STATUS } from "../enums/orderEnum";
import { IAddOrderRequest } from "../interfaces/orderInterfaces";
import { OrderModel } from "../models/OrderModel";

@Injectable()
export class OrderService {
    constructor(@Inject(OrderModel) private orderModel: MongooseModel<OrderModel>) { }

    async getAllUserOrders(email: string): Promise<OrderModel[]> {
        return this.orderModel.find({ email: email }).populate("productIds",{ name: 1, description: 1, images: { $slice: 1 }});
    }

    async getOrdersByOrderId(orderId: string): Promise<OrderModel | null> {
        return this.orderModel.findOne({ _id: orderId }).populate("addressId").populate("productIds",{ name: 1, description: 1, images: { $slice: 1 }});
    }

    async getAllOrdersByStatus(orderStatus: ORDER_STATUS, page: number,limit: number): Promise<OrderModel[]> {
        const response = await this.orderModel.aggregate([
            {
                $facet: {
                    orderDetails: [
                        {$match: {orderStatus: orderStatus}},
                        { $skip: (limit * page) },
                        { $limit: limit },
                        { $sort: { createdAt: -1 } }
                    ],
                totalOrders: [
                        {$match: {orderStatus: orderStatus}},
                        {
                            $count: 'totalOrders'
                        }
                    ]
                }
            }
        ]);
        return response[0];
    }

    async updateOrderStatus(id: string, orderStatus: ORDER_STATUS): Promise<unknown> {
        return this.orderModel.updateOne({ _id: id }, { $set: { orderStatus: orderStatus, updatedAt: new Date() } });
    }

    async addOrder(order: IAddOrderRequest):Promise<OrderModel>{
        return this.orderModel.create(order);
    }

}
