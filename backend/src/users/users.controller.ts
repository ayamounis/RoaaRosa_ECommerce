import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
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
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@ApiSecurity('token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @Get('getMe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get profile details',
    description: 'Fetches the current user details including saved shipping addresses.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: authentication token required.',
  })
  @ApiResponse({
    status: 404,
    description: 'User record not found.',
  })
  getMe(@CurrentUser('id') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Put('updateMe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update profile details',
    description: 'Updates customer name, email address, or mobile number.',
  })
  @ApiBody({ type: UpdateMeDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Email address already in use by another account.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(userId, dto);
  }

  @Put('changeMyPassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change password',
    description: 'Validates old password and sets new password, issuing fresh JWT.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully, new token returned.',
  })
  @ApiResponse({
    status: 400,
    description: 'Current password incorrect or password confirmation mismatch.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  changeMyPassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changeMyPassword(userId, dto);
  }
}
