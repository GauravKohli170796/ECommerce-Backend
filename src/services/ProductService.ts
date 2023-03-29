import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { IAddProductRequest, IUpdateProductRequest } from "../interfaces/productInterface";
import { CategoryModel } from "../models/CategoryModel";
import { ProductModel } from "../models/ProductModel";

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductModel) private productModel: MongooseModel<ProductModel>,
    @Inject(CategoryModel) private categoryModel: MongooseModel<CategoryModel>
  ) {}

  // This api will return latest created products for UI latest section and
  // all products in pagination fashion

  async getAllProducts(limit: number, page: number): Promise<ProductModel[]> {
    const response = await this.productModel.aggregate([
      {
        $facet: {
          latestProduct: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            { $project: { name: 1, description: 1, images: 1, discount: 1, price: 1 } }
          ],
          allProducts: [
            { $skip: limit * page },
            { $limit: limit },
            { $project: { name: 1, description: 1, images: 1, discount: 1, price: 1 } }
          ],
          totalProducts: [
            {
              $count: "totalProducts"
            }
          ]
        }
      }
    ]);
    return response[0];
  }

  async getProductById(id: string): Promise<unknown> {
    const response = await this.productModel.findById(id);
    if (!response) {
      throw new NotFound("Product not found with this id");
    }
    return response;
  }

  async addProduct(product: IAddProductRequest): Promise<unknown> {
    return await this.productModel.create(product);
  }

  async updateProduct(id: string, product: IUpdateProductRequest): Promise<unknown> {
    return await this.productModel.updateOne({ _id: id }, { $set: { ...product, updatedAt: new Date() } });
  }

  async deleteProduct(id: string): Promise<unknown> {
    const deleteResponse = await this.productModel.deleteOne({ _id: id });
    if (deleteResponse.deletedCount === 0) {
      throw new NotFound("Product not found with this id");
    }
    return deleteResponse;
  }

  async getAllCategories(): Promise<string[]> {
    const category = await this.categoryModel.find();
    return category[0]?.categories || [];
  }

  async addCategory(category: string): Promise<unknown> {
    return await this.categoryModel.updateOne({}, { $push: { categories: category } }, { upsert: true });
  }

  async getProductWithFilter(limit: number, page: number, filter: string): Promise<ProductModel[]> {
    const filterOptions = JSON.parse(filter);
    const aggregatePipeline: any[] = [];
    if (filterOptions.categories.length > 0) {
      aggregatePipeline.push({ $match: { category: { $in: filterOptions.categories } } });
    }
    if (filterOptions.price) {
      aggregatePipeline.push({ $match: { price: { $gte: filterOptions.price[0], $lte: filterOptions.price[1] } } });
    }
    if (filterOptions.priceSort) {
      aggregatePipeline.push({ $sort: { price: 1 } });
    }
    if (filterOptions.discountSort) {
      aggregatePipeline.push({ $sort: { discount: -1 } });
    }

    const response = await this.productModel.aggregate([
      {
        $facet: {
          allProducts: [
            ...aggregatePipeline,
            { $skip: limit * page },
            { $limit: limit },
            { $project: { name: 1, description: 1, images: 1, discount: 1, price: 1 } }
          ],
          totalProducts: [
            ...aggregatePipeline,
            { $project: { name: 1, description: 1, images: 1, discount: 1, price: 1 } },
            {
              $count: "totalProducts"
            }
          ]
        }
      }
    ]);
    return response[0];
  }

  async getSearchedProduct(searchString: string): Promise<ProductModel[]> {
    const priceFromSearchString = searchString.match(/\d+/);

    const searchRegex = searchString.split(" ").reduce((finalStr: string, str: string) => {
      if (["for", "a", "an", "in", "the", ""].includes(str)) {
        return finalStr;
      }
      return finalStr + `|${str}`;
    });

    const seachFullCondition: any[] = [];

    const searchOrCondition: any[] = [
      { description: { $regex: searchRegex, $options: "i" } },
      { name: { $regex: searchRegex, $options: "i" } }
    ];

    seachFullCondition.push({ $or: searchOrCondition });

    if (priceFromSearchString) {
      seachFullCondition.push({ price: { $lte: priceFromSearchString[0] } });
    }
    return await this.productModel
      .find({ $and: seachFullCondition }, { images: { $slice: 1 }, name: 1, price: 1, description: 1 })
      .limit(5);
  }
}
