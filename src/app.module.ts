import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './common/mail/mail.module';
import { PropertiesModule } from './properties/properties.module';
import config from './config/config';
import { LeasesModule } from './leases/leases.module';
import { SalesModule } from './sales/sales.module';
import { LandlordsModule } from './landlords/landlords.module';
import { TenantsModule } from './tenants/tenants.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { MongooseSchemasModule } from './common/mongoose/mongoose-schemas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseSchemasModule,
    UsersModule,
    AuthModule,
    MailModule,
    PropertiesModule,
    LeasesModule,
    SalesModule,
    LandlordsModule,
    TenantsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
