// routes.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';

export interface RouteInfo {
  method: string | RequestMethod;
  fullPath: string;
  controller: string;
  handler: string;
}

function joinPaths(controllerPath: string, methodPath: any): string {
  // In case methodPath is an array (it can be in some cases)
  const methodPaths = Array.isArray(methodPath) ? methodPath : [methodPath];
  const paths = methodPaths.map(p => {
    // Trim any leading/trailing slashes
    const cp = controllerPath ? controllerPath.toString().trim() : '';
    const mp = p ? p.toString().trim() : '';
    const joined = `/${cp}/${mp}`.replace(/\/+/g, '/');
    return joined === '' ? '/' : joined;
  });
  // If multiple method paths are provided, join them with a comma
  return paths.join(', ');
}

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(private readonly modulesContainer: ModulesContainer) {}

  public enumerateRoutes(): RouteInfo[] {
    const routes: RouteInfo[] = [];

    // The modules container holds a Map of all modules.
    // Iterate over each module:
    this.modulesContainer.forEach(moduleRef => {
      // For every controller in the module…
      moduleRef.controllers.forEach(controllerWrapper => {
        const controllerType = controllerWrapper.metatype;

        // “metatype” holds the controller class.
        if (!controllerType) {
          console.log("bailing");
          return;
        }
        // The controller route prefix comes from the @Controller('prefix') decorator.
        const controllerPath: string =
          Reflect.getMetadata(PATH_METADATA, controllerType) || '';

        // It is possible that the controller instance hasn’t been created.
        const instance = controllerWrapper.instance;
        if (!instance) {
          return;
        }

        // Grab the prototype, so that we can inspect the methods.
        const prototype = Object.getPrototypeOf(instance);

        // Get all property names from the prototype (but ignore the constructor).
        const methodNames = Object.getOwnPropertyNames(prototype).filter(
          name => name !== 'constructor' && typeof prototype[name] === 'function',
        );

        methodNames.forEach(methodName => {
          const methodHandler = prototype[methodName];
          // Only consider methods decorated with a HTTP method decorator (@Get, @Post, etc.).
          if (!Reflect.hasMetadata(METHOD_METADATA, methodHandler)) {
            return;
          }
          const requestMethod: string = Reflect.getMetadata(METHOD_METADATA, methodHandler);
          const methodPath = Reflect.getMetadata(PATH_METADATA, methodHandler) || '';

          const fullPath = joinPaths(controllerPath, methodPath);

          routes.push({
            method: requestMethod,
            fullPath,
            controller: controllerType.name,
            handler: methodName,
          });
        });
      });
    });
    return routes;
  }
}