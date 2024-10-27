import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('emailAuth.user'),
        pass: this.configService.get<string>('emailAuth.pass'),
      },
    });
  }

  async sendPasswordResetEmail(
    recipientEmail: string,
    OTP: string,
    firstName: string,
  ) {
    const mailOptions = {
      from: `'Landifi' <${this.configService.get<string>('emailAuth.user')}>`,
      to: recipientEmail,
      subject: 'Password Reset OTP',
      html: `<section>
        <p>Dear ${firstName}, </p>
        <p>You requested for a password reset. Kindly reset your password using the OTP below only valid for 60 minutes or one successful usage: </p>
        <h2>${OTP}</h2>
        <p><em>If this is not you, please ignore this email.</em></p>
        <p>Thank you</p>
        <p>Landifi Inc.</p>
      </section>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(
    recipientEmail: string,
    OTP: string,
    firstName: string,
  ) {
    const mailOptions = {
      from: `'Landifi' <${this.configService.get<string>('emailAuth.user')}>`,
      to: recipientEmail,
      subject: 'Email Verification OTP',
      html: `<section>
        <p>Dear ${firstName}, </p>
        <p>Thank you for registering. Kindly verify your account using the OTP below only valid for 60 minutes or one successful usage:</p>
        <h2>${OTP}</h2>
        <p><em>If this is not you, please ignore this email.</em></p>
        <p>Thank you</p>
        <p>Landifi Inc.</p>
      </section>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // TODO: Send email to landlords

  // TODO: Send email to tenants
}
