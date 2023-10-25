import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { ResourceNotFound } from "@tsed/platform-exceptions";
import { ORDER_STATUS } from "../enums/orderEnum";
import { ITokenPayload } from "../interfaces/authInterfaces";
import { IAddOrderRequest } from "../interfaces/orderInterfaces";
import { OrderModel } from "../models/OrderModel";
import { CartService } from "./CartService";
import { EmailService } from "./EmailService";

@Injectable()
export class OrderService {
  constructor(
    @Inject(OrderModel) private orderModel: MongooseModel<OrderModel>,
    @Inject(EmailService) private emailService: EmailService,
    @Inject(CartService) private cartService: CartService
  ) {}

  async getAllUserOrders(email: string): Promise<OrderModel[]> {
    return this.orderModel
      .find({ email: email })
      .populate("productIds", { name: 1, description: 1, images: { $slice: 1 } })
      .populate("addressId", { addressLine1: 1, addressLine2: 1, pinCode: 1, city: 1, state: 1 });
  }

  async getOrdersByOrderId(orderId: string): Promise<OrderModel | null> {
    return this.orderModel
      .findOne({ _id: orderId })
      .populate("addressId")
      .populate("productIds", { name: 1, description: 1, images: { $slice: 1 } });
  }

  async getAllOrdersByStatus(orderStatus: ORDER_STATUS, page: number, limit: number): Promise<OrderModel[]> {
    const response = await this.orderModel.aggregate([
      {
        $facet: {
          orderDetails: [
            { $match: { orderStatus: orderStatus } },
            { $sort: { createdAt: -1 } },
            { $skip: limit * page },
            { $limit: limit },
            { $lookup: { from: "addressmodels", localField: "addressId", foreignField: "_id", as: "addressDetails" } }
          ],
          totalOrders: [
            { $match: { orderStatus: orderStatus } },
            {
              $count: "totalOrders"
            }
          ]
        }
      }
    ]);
    return response[0];
  }

  async updateOrderStatus(id: string, orderStatus: ORDER_STATUS): Promise<OrderModel> {
    const updatedOrderStatus = await this.orderModel.findOneAndUpdate(
      { _id: id },
      { $set: { orderStatus: orderStatus, updatedAt: new Date() } },
      { returnOriginal: false }
    );
    if (!updatedOrderStatus) {
      throw new ResourceNotFound("No order is found with this Id");
    }
    this.emailService
      .sendOrderUpdatedStatus(updatedOrderStatus)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log("Updated Order Status Email sent successfully");
      })
      .catch((err) => console.error(err));
    return updatedOrderStatus;
  }

  async addOrder(userDetails: ITokenPayload, order: IAddOrderRequest): Promise<OrderModel> {
    const orderDetails = await this.orderModel.create({
      email: order.email,
      addressId: order.addressId,
      productIds: [...order.productIds],
      productDetails: [...order.productDetails]
    });
    await this.cartService.deleteUserCart(userDetails.email);
    this.emailService
      .sendOrderDetails(userDetails, orderDetails)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log("Order Email sent successfully");
      })
      .catch((err) => console.error(err));
    return orderDetails;
  }
}
