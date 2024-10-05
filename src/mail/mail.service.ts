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
    token: string,
    firstName: string,
  ) {
    const resetLink = `${this.configService.get<string>('frontend.url')}/reset-password?token=${token}`;
    const mailOptions = {
      from: `'Landifi' <${this.configService.get<string>('emailAuth.user')}>`,
      to: recipientEmail,
      subject: 'Password Reset Link',
      html: `<section>
        <p>Dear ${firstName}, </p>
        <p>You requested for a password reset. Click the reset link below to reset your password: </p>
        <a href="${resetLink}" target="_blank" style="cursor: pointer;"><button style="padding: 0.5rem 0.8rem; border-radius: 5px; cursor: pointer;">Reset Password</button></a>
        <p>If the above button is not working, please copy the following URL into your browser <strong><a href="${resetLink}" target="_blank" style="cursor: pointer;">${resetLink}</a></strong></p>
        <p><em>If this is not you, please ignore this email.</em></p>
        <p>Thank you</p>
        <p>Landifi Inc.</p>
      </section>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(
    recipientEmail: string,
    token: string,
    firstName: string,
  ) {
    const verificationLink = `${this.configService.get<string>('frontend.url')}/verification?token=${token}`;
    const mailOptions = {
      from: `'Landifi' <${this.configService.get<string>('emailAuth.user')}>`,
      to: recipientEmail,
      subject: 'Email Verification Link',
      html: `<section>
        <p>Dear ${firstName}, </p>
        <p>Thank you for registering. Click the verification link below to verify your email: </p>
        <a href="${verificationLink}" target="_blank" style="cursor: pointer;"><button style="padding: 0.5rem 0.8rem; border-radius: 5px; cursor: pointer;">Verify Email</button></a>
        <p>If the above button is not working, please copy the following URL into your browser <strong><a href="${verificationLink}" target="_blank" style="cursor: pointer;">${verificationLink}</a></strong></p>
        <p><em>If this is not you, please ignore this email.</em></p>
        <p>Thank you</p>
        <p>Landifi Inc.</p>
      </section>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
