import { ApiProperty } from '@nestjs/swagger';

export class TopProductDto {
  @ApiProperty({ type: String, example: 'prod_123' })
  id: string;

  @ApiProperty({ type: String, example: 'Classic Cotton Crewneck T-Shirt' })
  title: string;

  @ApiProperty({ type: Number, example: 120 })
  sold: number;

  @ApiProperty({ type: Number, example: 450 })
  price: number;

  @ApiProperty({ type: String, example: 'https://images.unsplash.com/photo-1' })
  imageCover: string;

  @ApiProperty({ type: Number, example: 4.8 })
  ratingsAverage: number;
}

export class RecentOrderDto {
  @ApiProperty({ type: String, example: 'ord_123' })
  id: string;

  @ApiProperty({ type: Number, example: 1250 })
  totalOrderPrice: number;

  @ApiProperty({ type: String, example: 'PENDING' })
  status: string;

  @ApiProperty({ type: Boolean, example: true })
  isPaid: boolean;

  @ApiProperty({ type: Date, example: '2026-10-18T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: String, example: 'Ahmed Ali' })
  customerName: string;

  @ApiProperty({ type: String, example: 'ahmed@example.com' })
  customerEmail: string;
}

export class MonthlySalesDto {
  @ApiProperty({ type: String, example: '2026-10' })
  month: string;

  @ApiProperty({ type: Number, example: 25000 })
  revenue: number;

  @ApiProperty({ type: Number, example: 45 })
  orders: number;
}

export class DashboardStatsDto {
  @ApiProperty({ type: Number, example: 150000 })
  totalRevenue: number;

  @ApiProperty({ type: Number, example: 320 })
  totalOrders: number;

  @ApiProperty({ type: Number, example: 12 })
  pendingOrders: number;

  @ApiProperty({ type: Number, example: 210 })
  totalCustomers: number;

  @ApiProperty({ type: Number, example: 85 })
  totalProducts: number;

  @ApiProperty({ type: Number, example: 78 })
  activeProducts: number;

  @ApiProperty({ type: Number, example: 5 })
  lowStockCount: number;

  @ApiProperty({ type: () => [TopProductDto] })
  topSellingProducts: TopProductDto[];

  @ApiProperty({ type: () => [RecentOrderDto] })
  recentOrders: RecentOrderDto[];

  @ApiProperty({ type: () => [MonthlySalesDto] })
  monthlySales: MonthlySalesDto[];
}
