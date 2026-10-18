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
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Subcategories')
@Controller('subcategories')
export class SubcategoriesController {
  constructor(
    @Inject(SubcategoriesService) private readonly subcategoriesService: SubcategoriesService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List subcategories',
    description: 'Lists all active subcategories with parent category references.',
  })
  @ApiResponse({
    status: 200,
    description: 'Subcategories list.',
  })
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get subcategory by ID',
    description: 'Returns subcategory details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Subcategory UUID',
    type: String,
    example: 'd3b2c1a0-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Subcategory found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategory not found.',
  })
  findById(@Param('id') id: string) {
    return this.subcategoriesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Create subcategory (Admin)',
    description: 'Creates new subcategory linked to parent category. Requires ADMIN role.',
  })
  @ApiBody({ type: CreateSubcategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Subcategory created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Subcategory slug already exists.',
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
    description: 'Parent category not found.',
  })
  create(@Body() dto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Update subcategory (Admin)',
    description: 'Updates subcategory properties. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Subcategory UUID', type: String })
  @ApiBody({ type: CreateSubcategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Subcategory updated.',
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
    description: 'Subcategory or category not found.',
  })
  update(@Param('id') id: string, @Body() dto: Partial<CreateSubcategoryDto>) {
    return this.subcategoriesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Delete subcategory (Admin)',
    description: 'Deletes subcategory if not referenced by products. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Subcategory UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Subcategory deleted successfully.',
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
    description: 'Subcategory not found.',
  })
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }
}
