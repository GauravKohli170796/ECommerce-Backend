import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { ICartItem, ICartUpdateReq } from "../interfaces/productInterface";
import { CartModel } from "../models/CartModel";

@Injectable()
export class CartService {
  constructor(@Inject(CartModel) private cartModel: MongooseModel<CartModel>) {}

  async getUserCartItems(email: string): Promise<unknown> {
    const response = await this.cartModel
      .find({ email: email })
      .populate("productId", { name: 1, description: 1, price: 1, discount: 1, images: { $slice: 1 } });
    return response;
  }

  async addItemToUserCart(email: string, cartItem: ICartItem): Promise<unknown> {
    const addCartItem = { email: email, ...cartItem };
    return await (
      await this.cartModel.create(addCartItem)
    ).populate("productId", { name: 1, description: 1, price: 1, discount: 1, images: { $slice: 1 } });
  }

  async updateItemOfUserCart(email: string, id: string, cartItem: ICartUpdateReq): Promise<unknown> {
    return await this.cartModel.updateOne({ _id: id, email: email }, { $set: { ...cartItem } });
  }

  async deleteItemFromUserCart(email: string, id: string): Promise<unknown> {
    const deleteResponse = await this.cartModel.deleteOne({ id: id, email: email });
    if (deleteResponse.deletedCount === 0) {
      throw new NotFound("Cart Item not found with this id");
    }
    return deleteResponse;
  }

  async deleteUserCart(email: string): Promise<unknown> {
    const deleteResponse = await this.cartModel.deleteMany({ email: email });
    return deleteResponse;
  }
}
