import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

@Injectable()
export class CategoriesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      results: categories.length,
      data: categories,
    };
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      data: category,
    };
  }

  async findSubcategoriesByCategory(categoryId: string) {
    // Check category exists
    await this.findById(categoryId);

    const subCategories = await this.prisma.subCategory.findMany({
      where: { categoryId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    // Frontend compatibility: expose `category` as categoryId string
    const formatted = subCategories.map((s) => ({
      id: s.id,
      _id: s.id,
      name: s.name,
      slug: s.slug,
      category: s.categoryId,
      categoryId: s.categoryId,
      createdAt: s.createdAt,
    }));

    return {
      results: formatted.length,
      data: formatted,
    };
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || slugify(dto.name);
    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });

    if (existing) {
      throw new BadRequestException('Category name or slug already exists');
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        image: dto.image,
      },
    });

    return {
      data: category,
    };
  }

  async update(id: string, dto: Partial<CreateCategoryDto>) {
    await this.findById(id);

    const data: Record<string, any> = {};
    if (dto.name) {
      data.name = dto.name;
      data.slug = dto.slug || slugify(dto.name);
    }
    if (dto.image !== undefined) data.image = dto.image;

    const updated = await this.prisma.category.update({
      where: { id },
      data,
    });

    return {
      data: updated,
    };
  }

  async remove(id: string) {
    await this.findById(id);

    // Enforce RESTRICT constraint before deletion
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      throw new BadRequestException(
        `Cannot delete category because it is referenced by ${productCount} products. (ON DELETE RESTRICT)`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Category deleted successfully',
    };
  }
}
