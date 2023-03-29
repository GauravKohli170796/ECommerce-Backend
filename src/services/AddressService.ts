import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { IAddressInfo } from "../interfaces/addressInterfaces";
import { AddressModel } from "../models/AddressModel";

@Injectable()
export class AddressService {
  constructor(@Inject(AddressModel) private addressModel: MongooseModel<AddressModel>) {}

  async getAllUserAddress(email: string): Promise<AddressModel[]> {
    return this.addressModel.find({ email: email });
  }

  async addAddress(addressInfo: IAddressInfo): Promise<AddressModel> {
    return await this.addressModel.create(addressInfo);
  }

  async updateAddress(id: string, addressInfo: IAddressInfo): Promise<unknown> {
    return await this.addressModel.updateOne(
      { _id: id, email: addressInfo.email },
      { $set: addressInfo },
      { returnOriginal: false }
    );
  }
}
