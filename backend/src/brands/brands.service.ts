import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';

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
export class BrandsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll() {
    const brands = await this.prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      results: brands.length,
      data: brands,
    };
  }

  async findById(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return {
      data: brand,
    };
  }

  async create(dto: CreateBrandDto) {
    const slug = dto.slug || slugify(dto.name);
    const existing = await this.prisma.brand.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });

    if (existing) {
      throw new BadRequestException('Brand name or slug already exists');
    }

    const brand = await this.prisma.brand.create({
      data: {
        name: dto.name,
        slug,
        image: dto.image,
      },
    });

    return {
      data: brand,
    };
  }

  async update(id: string, dto: Partial<CreateBrandDto>) {
    await this.findById(id);

    const data: Record<string, any> = {};
    if (dto.name) {
      data.name = dto.name;
      data.slug = dto.slug || slugify(dto.name);
    }
    if (dto.image !== undefined) data.image = dto.image;

    const updated = await this.prisma.brand.update({
      where: { id },
      data,
    });

    return {
      data: updated,
    };
  }

  async remove(id: string) {
    await this.findById(id);

    const productCount = await this.prisma.product.count({
      where: { brandId: id },
    });
    if (productCount > 0) {
      throw new BadRequestException(
        `Cannot delete brand because it is referenced by ${productCount} products. (ON DELETE RESTRICT)`,
      );
    }

    await this.prisma.brand.delete({
      where: { id },
    });

    return {
      message: 'Brand deleted successfully',
    };
  }
}
