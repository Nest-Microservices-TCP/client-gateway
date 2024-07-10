import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return await firstValueFrom(
      this.client.send('auth.register.user', registerUserDto).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await firstValueFrom(
      this.client.send('auth.login.user', loginUserDto).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  async verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return await firstValueFrom(
      this.client.send('auth.verify.token', {}).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }
}
