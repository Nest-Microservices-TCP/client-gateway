import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(
    /**
     * Para inyectar microservicios en nuestras clases, usamos el decorador
     * @Inject y le pasamos el token/nombre que le definimos al microservicio
     * el cual deseamos inyectar.
     *
     * En este caso el tipado del microservicio es ClientProxy por ser TCP
     */
    /**
     * Ahora, con el cambio de TCP al broker NATS, se podría decir que el cliente
     * es el mismo para todos, por ende podemos generalizar el nombre del servicio
     * como 'client', asi como el token ahora es el NATS_SERVICE
     */
    // @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProductDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  /**
   * Dado que aquí si estamos usando comunicación Http con el
   * client-gateway es que podemos usar los decoradores para
   * métodos Http, como en este caso el decorador @Query para
   * recuperar los parámetros de paginación
   */
  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto) {
    /**
     * La diferencia entre los métodos 'send' y 'emit' es que,
     * si se require recibir una respuesta para poder continuar,
     * usamos send, en caso contrario usamos emit, ya que este
     * solo emite el evento y continua sin esperar una respuesta
     *
     * * { cmd: 'findAll_products' }
     * Es el pattern el cual definimos
     * en el controller del microservicio de products
     *
     * * {}
     * Es el payload que puede ser enviado en la petición
     */
    return this.client.send({ cmd: 'findAll_products' }, paginationDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    /**
     * Cualquiera de estas dos formas funciona para propagar el error usando
     * nuestro exception filter personalizado, la decision depende de gustos
     */
    return this.client.send({ cmd: 'findOne_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
    // try {
    /**
     * La respuesta del microservicio sera un Observable.
     * Este observable podemos manejarlo usando firstValueFrom,
     * el cual nos permite manejar el observable como promesa ya
     * que este recibe un observable como parámetro. Este viene
     * de la librería de rxjs
     */
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'findOne_product' }, { id }),
    //   );
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    return this.client.send({ cmd: 'deleteOne_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch()
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.client
      .send({ cmd: 'updateOne_product' }, { id, ...updateProductDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
