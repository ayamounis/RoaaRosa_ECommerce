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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject(CategoriesService) private readonly categoriesService: CategoriesService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List categories',
    description: 'Returns all active categories ordered by creation date.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active categories.',
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Returns details of a specific category.',
  })
  @ApiParam({
    name: 'id',
    description: 'Category UUID',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Category found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  // Exact endpoint from frontend architecture: /categories/:id/subcategories
  @Public()
  @Get(':id/subcategories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List category subcategories',
    description: 'Retrieves all subcategories linked to this category.',
  })
  @ApiParam({
    name: 'id',
    description: 'Parent Category UUID',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'List of child subcategories.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  findSubcategories(@Param('id') id: string) {
    return this.categoriesService.findSubcategoriesByCategory(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Create category (Admin)',
    description: 'Adds a new category. Requires ADMIN role.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Category name or slug already exists.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Update category (Admin)',
    description: 'Updates existing category attributes. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Category UUID', type: String })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully.',
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
    description: 'Category not found.',
  })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCategoryDto>) {
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Delete category (Admin)',
    description: 'Deletes category if no products reference it. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Category UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully.',
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
    description: 'Category not found.',
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
