import {
  Controller,
  Get,
  Post,
  Put,
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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(@Inject(BrandsService) private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List brands',
    description: 'Lists all active clothing brands.',
  })
  @ApiResponse({
    status: 200,
    description: 'Brands list.',
  })
  findAll() {
    return this.brandsService.findAll();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get brand by ID',
    description: 'Returns brand details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Brand UUID',
    type: String,
    example: 'c1d2e3f4-a5b6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Brand found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Brand not found.',
  })
  findById(@Param('id') id: string) {
    return this.brandsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Create brand (Admin)',
    description: 'Creates new clothing brand. Requires ADMIN role.',
  })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Brand name or slug already exists.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Update brand (Admin)',
    description: 'Updates brand details. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Brand UUID', type: String })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: 200,
    description: 'Brand updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({
    status: 404,
    description: 'Brand not found.',
  })
  update(@Param('id') id: string, @Body() dto: Partial<CreateBrandDto>) {
    return this.brandsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Delete brand (Admin)',
    description: 'Deletes brand if not referenced by products. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Brand UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Brand deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete: referenced by products (RESTRICT).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({
    status: 404,
    description: 'Brand not found.',
  })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
