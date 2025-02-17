// show-routes.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RoutesModule } from './routes.module';
import { RoutesService } from './routes.service';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  // Create the full Nest application; this instantiates controllers.
  const app = await NestFactory.create(AppModule, { logger: false });
  // Force initialization of routes and controllers.
  await app.init();

  // Create an application context (no HTTP listener needed)
  // const appContext = await NestFactory.createApplicationContext(RoutesModule);
  const routesService = app.get(RoutesService);

  console.log('====================');
  console.log('    Routes List');
  console.log('====================\n');

  const routes = routesService.enumerateRoutes();

  // Format output similar to “rails routes”
  // For example: "GET    /users           -> UsersController.index"
  routes.forEach(route => {
    let methodAsString: string;

    // Convert a numeric HTTP method (if applicable) to its string representation.
    if (typeof route.method === 'string') {
      methodAsString = route.method.toUpperCase();
    } else {
      // route.method is a number (from RequestMethod enum)
      methodAsString =
        RequestMethod[route.method] || String(route.method);
    }

      console.log(
      // `${route.method.toUpperCase().padEnd(6)} ${route.fullPath.padEnd(20)} -> ${route.controller}.${route.handler}`,
      `${methodAsString} ${route.fullPath.padEnd(20)} -> ${route.controller}.${route.handler}`,
    );
  });

  await app.close();
}

bootstrap();