//TODO: Crear un snippet de esta configuración
import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

/**
 * Esta es la forma en la que podemos crear decoradores personalizados.
 * En este caso este es un decorador de parámetro, el cual va a obtener
 * el campo usuario, el cual viene en la request.
 *
 * Básicamente es como interceptar la request en base al tipo de request
 * y hacer lo que se desea con la misma
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request['user']) {
      throw new InternalServerErrorException('User not found in request');
    }

    return request['user'];
  },
);
