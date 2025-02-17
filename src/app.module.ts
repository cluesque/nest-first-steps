import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { RoutesModule } from './commands/routes.module';

@Module({
  imports: [RoutesModule],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
