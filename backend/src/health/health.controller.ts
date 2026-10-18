import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Service liveness & PostgreSQL database connection check',
    description:
      'Pings database via SELECT 1 and returns system status, timestamp, and version.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy and database is connected',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2026-10-17T00:00:00.000Z' },
        database: { type: 'string', example: 'connected' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Database connectivity error or internal server failure',
  })
  async checkHealth() {
    let dbStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (e: any) {
      dbStatus = `error: ${e.message}`;
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      version: '1.0.0',
    };
  }
}
