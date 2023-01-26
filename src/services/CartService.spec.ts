import { expect } from "chai";
import { PlatformTest } from "@tsed/common";
import { CartService } from "./CartService";

describe("CartService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should do something", () => {
    const instance = PlatformTest.get<CartService>(CartService);
    // const instance = PlatformTest.invoke<CartService>(CartService); // get fresh instance

    expect(instance).to.be.instanceof(CartService);
  });
});
