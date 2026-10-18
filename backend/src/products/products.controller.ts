import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
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
  ApiQuery,
  ApiBearerAuth,
  ApiSecurity,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

@ApiTags('Products')
@ApiExtraModels(CreateProductDto, CreateVariantDto, QueryProductsDto)
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(ProductsService) private readonly productsService: ProductsService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Query products catalog',
    description:
      'Queries and paginates products with keyword search, category, brand, and price filters.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page index',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 40,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description:
      'Sort order (-price, price, -sold, -ratingsAverage, title)',
    example: '-price',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Keyword query in title/description',
    example: 'Crewneck',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category UUID (or category[in])',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    type: String,
    description: 'Filter by brand UUID (or brand[in])',
  })
  @ApiQuery({
    name: 'price[gte]',
    required: false,
    type: Number,
    description: 'Minimum price filter in EGP',
    example: 200,
  })
  @ApiQuery({
    name: 'price[lte]',
    required: false,
    type: Number,
    description: 'Maximum price filter in EGP',
    example: 1200,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated product list with metadata.',
  })
  findAll(@Req() req: Request) {
    return this.productsService.findAll(req.query);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get product by ID',
    description:
      'Retrieves full product details including images, variants, category, and brand.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: String,
    example: 'e4f5a6b7-8901-2345-6789-abcdef012345',
  })
  @ApiResponse({ status: 200, description: 'Product details.' })
  @ApiResponse({
    status: 404,
    description: 'Product with specified ID not found.',
  })
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Public()
  @Get(':id/variants')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get product variants',
    description:
      'Retrieves size and color SKU variants for a specific product.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: String,
    example: 'e4f5a6b7-8901-2345-6789-abcdef012345',
  })
  @ApiResponse({
    status: 200,
    description: 'List of product variants with sizes and colors.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  getVariants(@Param('id') id: string) {
    return this.productsService.getVariants(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Create product (Admin)',
    description:
      'Creates a new clothing product with optional initial variant. Requires ADMIN role.',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Title already exists, or priceAfterDiscount > price.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Update product (Admin)',
    description: 'Updates clothing product details. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: String,
    example: 'e4f5a6b7-8901-2345-6789-abcdef012345',
  })
  @ApiBody({ type: CreateProductDto, required: false })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Soft delete product (Admin)',
    description:
      'Soft-deletes product by setting isActive to false. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: String,
    example: 'e4f5a6b7-8901-2345-6789-abcdef012345',
  })
  @ApiResponse({
    status: 200,
    description: 'Product marked inactive successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/variants')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('bearer')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Add product variant (Admin)',
    description:
      'Adds a size/color combination variant to a product. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: String,
    example: 'e4f5a6b7-8901-2345-6789-abcdef012345',
  })
  @ApiBody({ type: CreateVariantDto })
  @ApiResponse({ status: 201, description: 'Variant created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  addVariant(@Param('id') productId: string, @Body() dto: CreateVariantDto) {
    return this.productsService.addVariant(productId, dto);
  }
}
