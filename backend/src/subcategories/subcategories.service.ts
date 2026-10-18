import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';

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
export class SubcategoriesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.subCategory.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = list.map((s) => ({
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

  async findById(id: string) {
    const s = await this.prisma.subCategory.findUnique({
      where: { id },
    });

    if (!s) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    return {
      data: {
        id: s.id,
        _id: s.id,
        name: s.name,
        slug: s.slug,
        category: s.categoryId,
        categoryId: s.categoryId,
        createdAt: s.createdAt,
      },
    };
  }

  async create(dto: CreateSubcategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
    }

    const slug = dto.slug || slugify(dto.name);
    const existing = await this.prisma.subCategory.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new BadRequestException('SubCategory slug already exists');
    }

    const created = await this.prisma.subCategory.create({
      data: {
        name: dto.name,
        slug,
        categoryId: dto.categoryId,
      },
    });

    return {
      data: {
        ...created,
        category: created.categoryId,
      },
    };
  }

  async update(id: string, dto: Partial<CreateSubcategoryDto>) {
    await this.findById(id);

    const data: Record<string, any> = {};
    if (dto.name) {
      data.name = dto.name;
      data.slug = dto.slug || slugify(dto.name);
    }
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      data.categoryId = dto.categoryId;
    }

    const updated = await this.prisma.subCategory.update({
      where: { id },
      data,
    });

    return {
      data: {
        ...updated,
        category: updated.categoryId,
      },
    };
  }

  async remove(id: string) {
    await this.findById(id);

    const productCount = await this.prisma.product.count({
      where: { subcategoryId: id },
    });
    if (productCount > 0) {
      throw new BadRequestException(
        `Cannot delete subcategory because it is referenced by ${productCount} products. (ON DELETE RESTRICT)`,
      );
    }

    await this.prisma.subCategory.delete({
      where: { id },
    });

    return {
      message: 'SubCategory deleted successfully',
    };
  }
}
