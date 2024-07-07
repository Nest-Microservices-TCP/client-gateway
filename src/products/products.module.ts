import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  providers: [],
  /**
   * ? Registro simple de microservicio
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
  /**
   * ? Centralización del código del transporter de comunicación
   * Ahora, vamos a centralizar el código de configuración para el
   * protocolo de comunicación entre microservicios
   */
  imports: [
    // ClientsModule.register([
    /**
     * ? Cambio de protocolo de comunicación de TCP a NATS
     * Dado que ahora el microservicio de products se comunica
     * a traves de NATS, es necesario también cambiar la configuración
     * de comunicación del gateway para ese servicio, quedando de esta
     * forma:
     */
    // {
    //   name: PRODUCTS_SERVICE,
    //   transport: Transport.TCP,
    /**
     * Las options son los parámetros de conexión con el microservicio
     * en este caso definimos el host y el puerto donde puede buscar al
     * microservicio para hacer peticiones
     */
    //   options: {
    //     host: envs.productsMicroserviceHost,
    //     port: envs.productsMicroservicePort,
    //   },
    // },
    //   {
    //     name: NATS_SERVICE,
    //     transport: Transport.NATS,
    //     options: {
    //       servers: envs.natsServers,
    //     },
    //   },
    // ]),
    NatsModule,
  ],
})
export class ProductsModule {}
