import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTS_SERVICE, envs } from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  /**
   * El registro de microservicios se hace en el array de imports.
   * Esto puede hacerse en cualquier parte mientras el objeto
   * se agregue al array, en este caso se esta agregando en el
   * modulo de products dado que estamos registrando justamente el
   * microservicio de products.
   *
   * El name es una clave con la cual se va a identificar al
   * microservicio de entre todos los que serán registrados,
   * también hay que usar el mismo método de transporte que
   * fue definido en el respectivo microservicio
   */
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        /**
         * Las options son los parámetros de conexión con el microservicio
         * en este caso definimos el host y el puerto donde puede buscar al
         * microservicio para hacer peticiones
         */
        options: {
          host: envs.productsMicroserviceHost,
          port: envs.productsMicroservicePort,
        },
      },
    ]),
  ],
})
export class ProductsModule {}
