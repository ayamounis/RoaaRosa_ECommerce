import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async addAddress(userId: string, dto: CreateAddressDto) {
    const alias = dto.alias || dto.name || 'Home';

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    await this.prisma.address.create({
      data: {
        userId,
        alias,
        details: dto.details,
        phone: dto.phone,
        city: dto.city,
        postalCode: dto.postalCode,
        isDefault: dto.isDefault ?? false,
      },
    });

    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      status: 'success',
      message: 'Address added successfully',
      data: addresses,
    };
  }

  async getAddresses(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      status: 'success',
      results: addresses.length,
      data: addresses,
    };
  }

  async getAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return {
      status: 'success',
      data: address,
    };
  }

  async removeAddress(userId: string, addressId: string) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Address not found or unauthorized');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      status: 'success',
      message: 'Address removed successfully',
      data: addresses,
    };
  }
}
