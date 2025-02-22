import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { RoutesModule } from './commands/routes.module';
import { UserService } from './user/user.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    RoutesModule
  ],
  controllers: [AppController, CatsController],
  providers: [AppService, UserService],
})
export class AppModule {}
