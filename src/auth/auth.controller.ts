import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { TokenPayloadParam } from './params/token-payload.param';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { SetRoutePolicy } from './decorators/set-route-policy.decorator';
import { RoutePolicies } from './enum/route-policies.enum';
import { RoutePolicyGuard } from './guards/route-policy.guard';
import { UpdateMobilePhoneDto } from './dto/update-phone.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import CustomException from 'src/common/exceptions/custom-exception.exception';
import { RESOURCE_NOT_FOUND } from 'src/common/errors/errors-codes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body() body: { idToken: string }) {
    return this.authService.validateGoogleAuth(body.idToken);
  }

  @Get('lookup')
  async lookup(
    @Query('email') email?: string,
    @Query('mobilePhone') mobilePhone?: string,
  ) {
    const auth = await this.authService.findOne({
      email: email,
      mobilePhone: mobilePhone,
    });

    if (auth) {
      return {
        id: auth.user.id,
        role: auth.user.role,
        username:
          'username' in auth.user && typeof auth.user.username == 'string'
            ? auth.user.username
            : '',
      };
    }

    throw new CustomException(
      'Usuário não encontrado',
      RESOURCE_NOT_FOUND,
      [],
      HttpStatus.NOT_FOUND,
    );
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @SetRoutePolicy(RoutePolicies.user)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Put('email')
  updateEmail(@Body() updateEmailDto: UpdateEmailDto) {
    return this.authService.updateEmail(updateEmailDto);
  }

  @SetRoutePolicy(RoutePolicies.user)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Put('mobile-phone')
  updateMobilePhone(@Body() updateMobilePhoneDto: UpdateMobilePhoneDto) {
    return this.authService.updateMobilePhone(updateMobilePhoneDto);
  }

  @SetRoutePolicy(RoutePolicies.user)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Put('password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.authService.updatePassword(tokenPayloadDto, updatePasswordDto);
  }
}
