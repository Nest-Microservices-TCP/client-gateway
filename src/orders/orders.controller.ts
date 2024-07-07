import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Patch,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await firstValueFrom(
      this.client.send('createOrder', createOrderDto).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return await firstValueFrom(
      this.client.send('findAllOrders', orderPaginationDto).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
  }

  /**
   * Una buena practica cuando tenemos endpoints que reciben parámetros
   * es identificar estos parámetros mediante un prefijo extra para que
   * asi no se pisen unos con otros
   */
  @Get('id/:id')
  /**
   * ParseUUIDPipe nos permite parsear el string recibido a un
   * UUID, en caso de que esto no sea posible devuelve una excepción
   */
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await firstValueFrom(
      this.client.send('findOneOrder', { id }).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
  }

  @Get('status/:status')
  async findAllByStatus(
    /**
     * La razón de no colocar el valor 'status' dentro de @Param es que
     * deseamos tomar todo el objeto, en este caso el StatusDto
     */
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return await firstValueFrom(
      this.client
        .send('findAllOrders', { status: statusDto.status, ...paginationDto })
        .pipe(
          catchError((err) => {
            throw new RpcException(err);
          }),
        ),
    );
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    const { status } = statusDto;
    return await firstValueFrom(
      this.client.send('changeOrderStatus', { id, status }).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
  }
}
