import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { FitnessModel } from "../models/FitnessModel";
import { IAddWalkPadDataRequest } from "../interfaces/fitnessInterfaces";

@Injectable()
export class FitnessService {
  constructor(@Inject(FitnessModel) private fitnessModel: MongooseModel<FitnessModel>) {}

//   async getUserCartItems(email: string): Promise<unknown> {
//     const response = await this.fitnessModel
//       .find({ email: email })
//       .populate("productId", { name: 1, description: 1, price: 1, discount: 1, images: { $slice: 1 } });
//     return response;
//   }

  async addFitnessData(email: string, fitnessData: IAddWalkPadDataRequest): Promise<unknown> {
    const addFitnessData = { email, ...fitnessData };
    return await this.fitnessModel.create(addFitnessData);
  }

//   async updateItemOfUserCart(email: string, id: string, cartItem: ICartUpdateReq): Promise<unknown> {
//     return await this.cartModel.updateOne({ _id: id, email: email }, { $set: { ...cartItem } });
//   }

//   async deleteItemFromUserCart(email: string, id: string): Promise<unknown> {
//     const deleteResponse = await this.cartModel.deleteOne({ id: id, email: email });
//     if (deleteResponse.deletedCount === 0) {
//       throw new NotFound("Cart Item not found with this id");
//     }
//     return deleteResponse;
//   }

//   async deleteUserCart(email: string): Promise<unknown> {
//     const deleteResponse = await this.cartModel.deleteMany({ email: email });
//     return deleteResponse;
//   }
}
