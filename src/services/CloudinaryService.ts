import { PlatformMulterFile } from "@tsed/common";
import { Injectable } from "@tsed/di";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import sharp from "sharp";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: "dnqwvvtqf",
      api_key: "989491861814429",
      api_secret: "Y6w6O5QcxymN-UDfo-VjeVVVpRg"
    });
  }

  public async uploadResource(resource: PlatformMulterFile[]): Promise<string[]> {
    try {
      const imagesUrl: string[] = [];
      for (const res of resource) {
        const data = await sharp(res.buffer).webp({ quality: 80 }).toBuffer();
        const filePath = parser.format(path.extname(res.originalname).toString(), data);
        const imageInfo = await cloudinary.uploader.upload(filePath.content, {
          folder: "ProductTest"
        });
        imagesUrl.push(imageInfo.secure_url);
      }
      return imagesUrl;
    } catch (err) {
      console.error(err.message);
      return err;
    }
  }
}
