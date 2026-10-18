import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Addresses')
@ApiBearerAuth('bearer')
@ApiSecurity('token')
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(
    @Inject(AddressesService) private readonly addressesService: AddressesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add shipping address',
    description: 'Saves a new shipping address for the authenticated user and returns all updated addresses.',
  })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({
    status: 200,
    description: 'Address created and full updated address list returned.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid address data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  addAddress(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.addressesService.addAddress(userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List shipping addresses',
    description: 'Retrieves all saved delivery addresses for the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of addresses returned.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  getAddresses(@CurrentUser('id') userId: string) {
    return this.addressesService.getAddresses(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get single address',
    description: 'Retrieves a single address by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Address UUID',
    type: String,
    example: 'b3f545a1-7782-4ad5-934d-17688cce8c29',
  })
  @ApiResponse({
    status: 200,
    description: 'Address details returned.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found.',
  })
  getAddress(
    @CurrentUser('id') userId: string,
    @Param('id') addressId: string,
  ) {
    return this.addressesService.getAddress(userId, addressId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove shipping address',
    description: 'Deletes address and returns remaining addresses.',
  })
  @ApiParam({
    name: 'id',
    description: 'Address UUID',
    type: String,
    example: 'b3f545a1-7782-4ad5-934d-17688cce8c29',
  })
  @ApiResponse({
    status: 200,
    description: 'Address deleted and updated address list returned.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found or unauthorized.',
  })
  removeAddress(
    @CurrentUser('id') userId: string,
    @Param('id') addressId: string,
  ) {
    return this.addressesService.removeAddress(userId, addressId);
  }
}
