import { Controller, Get, Res, Request, Query, Param } from '@nestjs/common';
import { response } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }  

  @Get('breed')
  findBreed(): Object {
  //   return 'This action returns cat breeds';
    return { breed: 'Siamese' };
  }

  @Get('color')
  findColor(@Query() color: string, @Res() response) {
    response.status(202).send({ color: color, wtf: 'dude' });
  }

  @Get('name/:name')
  findName(@Param() name?: string) {
    return { name: name };
  }
}
