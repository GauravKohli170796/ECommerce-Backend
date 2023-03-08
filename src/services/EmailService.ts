import { Injectable } from "@tsed/di";
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { ITokenPayload } from "../interfaces/authInterfaces";
import { IEmailBody } from "../interfaces/emailInterfaces";

@Injectable()
export class EmailService {
  private transporter;
  constructor(){
    this.transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'harshsaxena9411@gmail.com',
          pass: 'cltaqddmbfvamgos'
        }
      }));
  }

  sendEmail(userDetails:ITokenPayload,emailBody:IEmailBody):Promise<boolean>{
   emailBody.email = emailBody.email.replace("{%Email%}",userDetails.email);
    const mailOptions = {
        from: 'harshsaxena9411@gmail.com',
        to: [userDetails.email],
        subject: 'Congratulation! New Order Request.',
        html: emailBody.email
      };
      return new Promise((resolve,reject)=>{
        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              reject(false);
            } else {
              resolve(true);
            }
          });  
      })
     
  }
}
