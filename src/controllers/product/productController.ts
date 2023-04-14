import { MultipartFile, PlatformMulterFile } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Description, Get, Post, Put, Required } from "@tsed/schema";
import { IAddProductRequest, ICategoryReq, IUpdateProductRequest } from "../../interfaces/productInterface";
import { ProductModel } from "../../models/ProductModel";
import { CloudinaryService } from "../../services/CloudinaryService";
import { ProductService } from "../../services/ProductService";

@Controller("")
export class ProductController {
  constructor(
    @Inject(ProductService) private productService: ProductService,
    @Inject(CloudinaryService) private cloudinaryService: CloudinaryService
  ) {}
  @Get("/:limit/:page")
  @Description("Return a list of products")
  get(@PathParams("limit") @Required() limit: string, @PathParams("page") @Required() page: string) {
    return this.productService.getAllProducts(parseInt(limit), parseInt(page));
  }

  @Get("/getAllCategories")
  getAllCategories(): Promise<string[]> {
    return this.productService.getAllCategories();
  }

  @Get("/getFilteredProduct/:limit/:page")
  @Description("Return a list of products after applying filters")
  getProductWithFilter(
    @PathParams("limit") @Required() limit: string,
    @PathParams("page") @Required() page: string,
    @QueryParams("filter") @Required() filter: string
  ): Promise<ProductModel[]> {
    return this.productService.getProductWithFilter(parseInt(limit), parseInt(page), filter);
  }

  @Get("/getSearchedProducts")
  @Description("Return a list of products after applying search string")
  getSearchedProducts(@QueryParams("search") @Required() search: string): Promise<ProductModel[]> {
    return this.productService.getSearchedProduct(search);
  }

  @Put("/addNewCategories")
  addNewCategories(@BodyParams() @Required() categoryReq: ICategoryReq) {
    return this.productService.addCategory(categoryReq.category);
  }

  @Get("/:id")
  @Description("Get all details of single product using its id")
  getProductById(@PathParams("id") @Required() id: string) {
    return this.productService.getProductById(id);
  }

  @Post("/addProduct")
  async addProduct(@BodyParams() @Required() product: IAddProductRequest) {
    return this.productService.addProduct(product);
  }

  @Post("/uploadFile")
  uploadFile(@MultipartFile("images") @Required images: PlatformMulterFile[]) {
    return this.cloudinaryService.uploadResource(images);
  }

  @Put("/updateProduct/:id")
  updateProduct(@PathParams("id") @Required() id: string, @BodyParams() @Required() product: IUpdateProductRequest) {
    return this.productService.updateProduct(id, product);
  }

  @Delete("/deleteProduct/:id")
  deleteProduct(@PathParams("id") @Required() id: string) {
    return this.productService.deleteProduct(id);
  }
}
