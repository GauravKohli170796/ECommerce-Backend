import { Injectable } from "@tsed/di";
import ejs from "ejs";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import path from "path";
import { ITokenPayload } from "../interfaces/authInterfaces";
import { EmailTypes, IEmailBody } from "../interfaces/emailInterfaces";
import { OrderModel } from "../models/OrderModel";

@Injectable()
export class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "harshsaxena9411@gmail.com",
          pass: "xegknqsdhhxfeuhv"
        }
      })
    );
  }

  sendOtp(emailBody: IEmailBody): Promise<boolean> {
    let mailMessage = "";
    let mailSubject = "";
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ref = this;
    // TODO document why this block is empty

    if (emailBody.type === EmailTypes.SIGNUP) {
      mailSubject = "One time password for Registeration.";
      mailMessage = `Thank you for registering with us. Your One time password for registration is "${emailBody.otp}"`;
    } else {
      mailSubject = "One time password to reset your Password.";
      mailMessage = `Your One time password to reset your Password is "${emailBody.otp}"`;
    }
    const mailOptions = {
      from: "harshsaxena9411@gmail.com",
      to: [emailBody.email],
      subject: mailSubject,
      text: mailMessage
    };
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ref.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  sendOrderDetails(userDetails: ITokenPayload, orderDetails: OrderModel): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ref = this;
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, "../../views/orderDetails.ejs");
      ejs.renderFile(filePath, { orderDetails: orderDetails }, function (err: unknown, data: string) {
        if (err) {
          reject(false);
        }
        const mailOptions = {
          from: "harshsaxena9411@gmail.com",
          to: [userDetails.email],
          subject: `Congratulation for your Order.Your order id is ${orderDetails._id}`,
          html: data
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ref.transporter.sendMail(mailOptions, function (error: unknown, info: unknown) {
          if (error) {
            reject(false);
          } else {
            resolve(true);
          }
        });
      });
    });
  }

  sendOrderUpdatedStatus(orderDetails: OrderModel): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ref = this;
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, "../../views/orderUpdateStatus.ejs");
      ejs.renderFile(filePath, { orderDetails: orderDetails }, function (err: unknown, data: string) {
        if (err) {
          reject(false);
        }
        const mailOptions = {
          from: "harshsaxena9411@gmail.com",
          to: [orderDetails.email],
          subject: `Your order with Id ${orderDetails._id} is ${orderDetails.orderStatus}`,
          html: data
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ref.transporter.sendMail(mailOptions, function (error: unknown, info: unknown) {
          if (error) {
            reject(false);
          } else {
            resolve(true);
          }
        });
      });
    });
  }
}
