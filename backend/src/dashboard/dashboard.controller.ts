import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@ApiTags('Dashboard')
@ApiBearerAuth('bearer')
@ApiSecurity('token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(DashboardService) private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Dashboard overview statistics retrieved successfully.',
    type: DashboardStatsDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized – JWT token is missing or invalid.' })
  @ApiForbiddenResponse({ description: 'Forbidden – Only admins can access this resource.' })
  getOverview(): Promise<DashboardStatsDto> {
    return this.dashboardService.getOverview();
  }
}
