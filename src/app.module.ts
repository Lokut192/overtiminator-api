import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UtilsService } from './utils/utils.service';
import { MeUserModule } from './me-user/me-user.module';
import { GlobalUserSettingsModule } from './global-user-settings/global-user-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE', 'sqlite') as 'sqlite',
        database: configService.get<string>('DB_NAME', 'data/database.sqlite'),
        entities: ['dist/entities/**/*.entity.js'],
        synchronize: false,
        migrations: ['dist/migrations/*.js'],
        // logging: false,
      }),
    }),
    UserModule,
    AuthModule,
    MeUserModule,
    GlobalUserSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UtilsService],
})
export class AppModule {}
