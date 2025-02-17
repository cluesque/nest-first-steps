import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger, INestApplication, Controller } from '@nestjs/common';
import { Command } from 'commander';
import chalk from 'chalk';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Reflector } from '@nestjs/core';
import { ROUTE_MAPPED_MESSAGE } from '@nestjs/core/helpers/messages';

// // chatgpt proposed this method first,
// // but server._events.request._router is nil, so it doesn't work
// // when challenged chatgpt says:
// // You're right! The _events.request._router method doesn't always work, especially in newer versions of NestJS or when using Fastify instead of Express. Let's fix this properly using NestJS's built-in reflection capabilities.
// async function getRoutesFirstDraft(app: INestApplication) {
//   const server = app.getHttpServer();
//   const router = server._events.request._router; // Express router
  
//   console.log(chalk.blue.bold('\n📌 Registered Routes:\n'));
//   console.log(chalk.yellow.bold('METHOD    PATH\n') + '----------------------------------');

//   router.stack.forEach((layer) => {
//     if (layer.route) {
//       const methods = Object.keys(layer.route.methods)
//         .map((m) => chalk.green(m.toUpperCase()))
//         .join(', ');
//       console.log(`${methods.padEnd(10)} ${layer.route.path}`);
//     }
//   });

//   await app.close();
// }


// // The second draft chatgpt proposed is this one
// import { RoutesResolver } from '@nestjs/core/router/routes-resolver';
// import { HttpAdapterHost } from '@nestjs/core';

// // ... but it didn't compile, so I commented out the offending line and have here the copilot suggestion

// // it still doesn't work, and I say this to chatgpt, which says "you're right!"
// // ... and suggests the next version
// async function getRoutesSecond(app: INestApplication) {
//   const httpAdapterHost = app.get(HttpAdapterHost);
//   const routesResolver = app.get(RoutesResolver);
//   // const routes = routesResolver.getRoutes(httpAdapterHost.httpAdapter);
//   // won't compile - copilot says:
//   // To fix the error, you need to use the routes property of the RoutesResolver class instead of the non-existent getRoutes method.
//   const routes = routesResolver['routes'];

//   console.log(chalk.blue.bold('\n📌 Registered Routes:\n'));
//   console.log(chalk.yellow.bold('METHOD     PATH\n') + '----------------------------------');

//   routes.forEach(({ path, method }) => {
//     const methodFormatted = chalk.green(method.toUpperCase()).padEnd(10);
//     console.log(`${methodFormatted} ${path}`);
//   });

//   await app.close();
// }

// import { ModulesContainer } from '@nestjs/core/injector/modules-container';
// import { MetadataScanner } from '@nestjs/core/metadata-scanner';
// import { Reflector } from '@nestjs/core';

// async function getRoutes(app: INestApplication) {
//   const modulesContainer = app.get(ModulesContainer);
//   const metadataScanner = new MetadataScanner();
//   const reflector = new Reflector();

//   console.log(chalk.blue.bold('\n📌 Registered Routes:\n'));
//   console.log(chalk.yellow.bold('METHOD     PATH\n') + '----------------------------------');

//   for (const [_, moduleRef] of modulesContainer.entries()) {
//     for (const [__, provider] of moduleRef.providers) {
//       const { instance } = provider;
//       if (!instance || !instance.constructor) continue;

//       const controllerPath = Reflect.getMetadata('path', instance.constructor);
//       if (!controllerPath) continue;

//       const methods = metadataScanner.scanFromPrototype(
//         instance,
//         Object.getPrototypeOf(instance),
//         (method) => {
//           const routePath = Reflect.getMetadata('path', instance[method]);
//           const requestMethod = Reflect.getMetadata('method', instance[method]);

//           if (routePath && requestMethod !== undefined) {
//             const methodFormatted = chalk.green(requestMethod.toUpperCase()).padEnd(10);
//             console.log(`${methodFormatted} /${controllerPath}/${routePath}`.replace(/\/+/g, '/'));
//           }
//         },
//       );
//     }
//   }

//   await app.close();
// }

/// Fourth draft: won't compile, as RouterExplorer wants 8 arguments, not 3
/// chatgpt says: "You're right! The RouterExplorer class requires more arguments than we can easily provide. Let's take a different approach using NestJS’s internal methods that work reliably.

// import { RouterExplorer } from '@nestjs/core/router/router-explorer';
// import { HttpAdapterHost } from '@nestjs/core';

// async function getRoutes(app: INestApplication) {
//   const httpAdapterHost = app.get(HttpAdapterHost);
//   const routerExplorer = new RouterExplorer(httpAdapterHost.httpAdapter, app.select(AppModule), null);

//   const routes = routerExplorer.getRoutes(app.getHttpAdapter());

//   console.log(chalk.blue.bold('\n📌 Registered Routes:\n'));
//   console.log(chalk.yellow.bold('METHOD     PATH\n') + '----------------------------------');

//   routes.forEach(({ path, method }) => {
//     const methodFormatted = chalk.green(method.toUpperCase()).padEnd(10);
//     console.log(`${methodFormatted} ${path}`);
//   });

//   await app.close();
// }

async function getRoutes(app: INestApplication) {
  const modulesContainer = app.get(ModulesContainer);
  const reflector = app.get(Reflector);

  console.log(chalk.blue.bold('\n📌 Registered Routes:\n'));
  console.log(chalk.yellow.bold('METHOD     PATH\n') + '----------------------------------');

  for (const [_, moduleRef] of modulesContainer.entries()) {
    for (const [__, provider] of moduleRef.providers) {
      const { instance } = provider;
      if (!instance) continue;

      const controllerPath = Reflect.getMetadata('path', instance.constructor);
      if (!controllerPath) continue;

      const methods = Object.getOwnPropertyNames(instance.constructor.prototype).filter(
        (method) => method !== 'constructor',
      );

      methods.forEach((method) => {
        const routePath = Reflect.getMetadata('path', instance[method]);
        const requestMethod = Reflect.getMetadata('method', instance[method]);

        if (routePath !== undefined && requestMethod !== undefined) {
          const fullPath = `/${controllerPath}/${routePath}`.replace(/\/+/g, '/');
          const methodFormatted = chalk.green(requestMethod.toUpperCase()).padEnd(10);
          console.log(`${methodFormatted} ${fullPath}`);
        }
      });
    }
  }

  await app.close();
}


///




async function listRoutes() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  await getRoutes(app);
  // await getRoutes();
}

const program = new Command();
program
  .command('routes')
  .description('List all registered routes in the NestJS application')
  .action(() => {
    listRoutes().catch((err) => {
      console.error(chalk.red('❌ Error fetching routes'), err);
    });
  });

program.parse(process.argv);
