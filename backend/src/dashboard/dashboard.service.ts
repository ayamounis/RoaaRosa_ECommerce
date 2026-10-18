import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DashboardStatsDto,
  MonthlySalesDto,
  RecentOrderDto,
  TopProductDto,
} from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getOverview(): Promise<DashboardStatsDto> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      revenueAgg,
      pendingOrders,
      totalCustomers,
      totalProducts,
      activeProducts,
      lowStockCount,
      topSellingProducts,
      recentOrders,
      monthlySalesRaw,
    ] = await Promise.all([
      // Total revenue & total orders
      this.prisma.order.aggregate({
        _sum: { totalOrderPrice: true },
        _count: true,
      }),

      // Pending orders count
      this.prisma.order.count({ where: { status: 'PENDING' } }),

      // Total customers (role = USER)
      this.prisma.user.count({ where: { role: 'USER' } }),

      // Total products
      this.prisma.product.count(),

      // Active products
      this.prisma.product.count({ where: { isActive: true } }),

      // Low stock variants (stockQuantity < 5)
      this.prisma.productVariant.count({
        where: { stockQuantity: { lt: 5 } },
      }),

      // Top 5 selling products
      this.prisma.product.findMany({
        orderBy: { sold: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          sold: true,
          price: true,
          imageCover: true,
          ratingsAverage: true,
        },
      }),

      // Recent 10 orders with customer info
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),

      // Orders in last 6 months for monthly grouping
      this.prisma.order.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { totalOrderPrice: true, createdAt: true },
      }),
    ]);

    // --- Map top selling products ---
    const topProducts: TopProductDto[] = topSellingProducts.map((p) => ({
      id: p.id,
      title: p.title,
      sold: p.sold,
      price: Number(p.price),
      imageCover: p.imageCover,
      ratingsAverage: Number(p.ratingsAverage),
    }));

    // --- Map recent orders ---
    const mappedRecentOrders: RecentOrderDto[] = recentOrders.map((o) => ({
      id: o.id,
      totalOrderPrice: Number(o.totalOrderPrice),
      status: o.status,
      isPaid: o.isPaid,
      createdAt: o.createdAt,
      customerName: o.user?.name ?? 'Unknown',
      customerEmail: o.user?.email ?? 'Unknown',
    }));

    // --- Group orders by year-month for monthly sales ---
    const monthMap = new Map<string, { revenue: number; orders: number }>();
    for (const order of monthlySalesRaw) {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthMap.get(key) ?? { revenue: 0, orders: 0 };
      existing.revenue += Number(order.totalOrderPrice);
      existing.orders += 1;
      monthMap.set(key, existing);
    }

    const monthlySales: MonthlySalesDto[] = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        revenue: parseFloat(data.revenue.toFixed(2)),
        orders: data.orders,
      }));

    return {
      totalRevenue: parseFloat(
        Number(revenueAgg._sum.totalOrderPrice ?? 0).toFixed(2),
      ),
      totalOrders: revenueAgg._count,
      pendingOrders,
      totalCustomers,
      totalProducts,
      activeProducts,
      lowStockCount,
      topSellingProducts: topProducts,
      recentOrders: mappedRecentOrders,
      monthlySales,
    };
  }
}
