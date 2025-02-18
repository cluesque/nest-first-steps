import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { RoutesModule } from './commands/routes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RoutesModule
  ],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
