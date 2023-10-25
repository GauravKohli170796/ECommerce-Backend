import { BodyParams, PathParams, Req } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { UseBefore } from "@tsed/platform-middlewares";
import { Get, Post, Put, Required } from "@tsed/schema";
import { ORDER_STATUS } from "../../enums/orderEnum";
import { ITokenPayload } from "../../interfaces/authInterfaces";
import { IAddOrderRequest, IUpdateOrderStatus } from "../../interfaces/orderInterfaces";
import { AdminMiddleware } from "../../middlewares/AdminMiddleware";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { OrderService } from "../../services/OrderService";

@Controller("")
@UseBefore(AuthMiddleware)
export class OrdersController {
  constructor(@Inject(OrderService) private orderService: OrderService) {}
  @Get("/getAllUserOrders")
  get(@Req() req: Req) {
    const userDetails = req.user as ITokenPayload;
    return this.orderService.getAllUserOrders(userDetails.email);
  }

  @Get("/getOrdersByOrderId/:orderId")
  @UseBefore(AdminMiddleware)
  getOrdersByOrderId(@PathParams("orderId") @Required() orderId: string) {
    return this.orderService.getOrdersByOrderId(orderId);
  }

  //@UseBefore(AdminMiddleware)
  @Get("/getAllOrdersByStatus/:limit/:page/:orderStatus")
  @UseBefore(AdminMiddleware)
  getAllOrdersByStatus(
    @PathParams("limit") @Required() limit: string,
    @PathParams("page") @Required() page: string,
    @PathParams("orderStatus") @Required() orderStatus: ORDER_STATUS
  ) {
    return this.orderService.getAllOrdersByStatus(orderStatus, parseInt(page), parseInt(limit));
  }

  @Put("/updateOrderStatus/:orderId")
  @UseBefore(AdminMiddleware)
  updateOrderStatus(
    @PathParams("orderId") @Required() orderId: string,
    @BodyParams() @Required() orderStatusReq: IUpdateOrderStatus
  ) {
    return this.orderService.updateOrderStatus(orderId, orderStatusReq.orderStatus);
  }

  @Post("/addOrder")
  addOrder(@Req() req: Req, @BodyParams() @Required() orderDetails: IAddOrderRequest) {
    const userDetails = req.user as ITokenPayload;
    return this.orderService.addOrder(userDetails, { ...orderDetails, email: userDetails.email });
  }
}
