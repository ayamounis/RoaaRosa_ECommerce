import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@ApiSecurity('token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  // ─── Authenticated user routes ────────────────────────────────────────────

  @Get('getMe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get profile details', description: 'Fetches the current user details including saved shipping addresses.' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication token required.' })
  @ApiResponse({ status: 404, description: 'User record not found.' })
  getMe(@CurrentUser('id') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Put('updateMe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile details', description: 'Updates customer name, email address, or mobile number.' })
  @ApiBody({ type: UpdateMeDto })
  @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Email address already in use by another account.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(userId, dto);
  }

  @Put('changeMyPassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password', description: 'Validates old password and sets new password, issuing fresh JWT.' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully, new token returned.' })
  @ApiResponse({ status: 400, description: 'Current password incorrect or password confirmation mismatch.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  changeMyPassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changeMyPassword(userId, dto);
  }

  // ─── Admin-only routes ────────────────────────────────────────────────────

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] List all customers', description: 'Returns a paginated list of all customers. Supports keyword search on name or email.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Search by name or email' })
  @ApiResponse({ status: 200, description: 'Paginated list of customers returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required.' })
  getAllUsers(@Query() query: QueryUserDto) {
    return this.usersService.getAllUsers(query);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Admin] Create a new user', description: 'Creates a new customer or admin user account.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User account created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed or email already registered.' })
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Update customer profile', description: 'Updates customer details, role, status or resets password.' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Customer profile updated successfully.' })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Get customer by ID', description: 'Returns full customer profile including addresses and last 10 orders.' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer details returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Deactivate a customer', description: 'Sets the customer\'s isActive flag to false.' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer deactivated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  deactivateUser(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }

  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Activate a customer', description: 'Sets the customer\'s isActive flag to true.' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer activated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Delete a customer', description: 'Hard-deletes the customer record by ID.' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
