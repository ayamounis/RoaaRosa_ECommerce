import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AuthModule } from '../auth/auth.module';
import { CouponsModule } from '../coupons/coupons.module';

@Module({
  imports: [AuthModule, CouponsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
