// routes.module.ts
import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';

@Module({
  providers: [RoutesService],
  exports: [RoutesService],  // this is important to make it available outside
})
export class RoutesModule {}