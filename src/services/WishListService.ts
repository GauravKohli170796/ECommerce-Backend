import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { IWishListItem } from "../interfaces/productInterface";
import { WishListModel } from "../models/WishListModel";

@Injectable()
export class WishListService {
    constructor(@Inject(WishListModel) private wishListModel: MongooseModel<WishListModel>) { }

    async getUserWishListItems(email: string): Promise<unknown> {
        const response = await this.wishListModel.find({ email: email }).populate("productId", { name: 1, description: 1, images: { $slice: 1 } });
        return response;
    }

    async addItemToUserWishList(email: string, wishListItem: IWishListItem): Promise<unknown> {
        const addWishListItem = { email: email, ...wishListItem };
        return await this.wishListModel.create(addWishListItem);
    }

    async deleteItemFromUserWishList(email: string, id: string): Promise<unknown> {
        const deleteResponse = await this.wishListModel.deleteOne({ id: id, email: email });
        if (deleteResponse.deletedCount === 0) {
            throw new NotFound("Wish List Item not found with this id");
        }
        return deleteResponse;
    }

}
