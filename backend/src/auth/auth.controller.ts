import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register customer account',
    description: 'Creates a new user account with role USER and returns a JWT token.',
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered and authenticated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failure, email already in use, or password confirmation mismatch.',
  })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Customer sign in',
    description: 'Authenticates credentials and returns a JWT token.',
  })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful, JWT token returned.',
  })
  @ApiResponse({
    status: 401,
    description: 'Incorrect email or password, or account inactive.',
  })
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  // Exact endpoint name used by Next.js frontend: forgotPasswords (plural)
  @Public()
  @Post('forgotPasswords')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset code',
    description: 'Generates and sends a 6-digit verification code to the registered email address.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Reset code successfully generated and dispatched.',
  })
  @ApiResponse({
    status: 404,
    description: 'No user registered with this email address.',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // Exact endpoint name used by Next.js frontend: verifyResetCode
  @Public()
  @Post('verifyResetCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify password reset code',
    description: 'Validates 6-digit code against expiration (10 min) and marks verified.',
  })
  @ApiBody({ type: VerifyResetCodeDto })
  @ApiResponse({
    status: 200,
    description: 'Reset code verified successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Reset code is invalid or has expired.',
  })
  verifyResetCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(dto);
  }

  // Exact endpoint name used by Next.js frontend: resetPassword
  @Public()
  @Put('resetPassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset account password',
    description: 'Updates user password after code verification and returns a new session token.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully, new JWT token returned.',
  })
  @ApiResponse({
    status: 400,
    description: 'Reset code not verified.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // Authenticated user profile verification endpoint
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns profile details of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile retrieved.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: missing or invalid authentication token.',
  })
  getMe(@CurrentUser() user: any) {
    return {
      message: 'success',
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
