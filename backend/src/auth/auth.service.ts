import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    if (dto.password !== dto.rePassword) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const email = dto.email.toLowerCase().trim();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email,
        password: hashedPassword,
        phone: dto.phone,
        role: Role.USER,
      },
    });

    const token = await this.generateToken(user.id, user.email, user.role);

    return {
      message: 'success',
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async signin(dto: SigninDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const token = await this.generateToken(user.id, user.email, user.role);

    return {
      message: 'success',
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('There is no user with this email address');
    }

    // Generate deterministic or cryptographically random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetCode: resetCode,
        passwordResetExpires: resetExpires,
        passwordResetVerified: false,
      },
    });

    this.logger.log(`🔑 [DEV-MODE] Password reset code for ${email}: ${resetCode}`);

    return {
      statusMsg: 'success',
      message: 'Reset code sent to email',
    };
  }

  async verifyResetCode(dto: VerifyResetCodeDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetCode: dto.resetCode,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Reset code is invalid or has expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetVerified: true,
      },
    });

    return {
      status: 'Success',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('No user found with this email');
    }

    if (!user.passwordResetVerified) {
      throw new BadRequestException('reset code not verified');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetExpires: null,
        passwordResetVerified: null,
        passwordChangedAt: new Date(),
      },
    });

    const token = await this.generateToken(
      updatedUser.id,
      updatedUser.email,
      updatedUser.role,
    );

    return {
      token,
    };
  }

  private async generateToken(userId: string, email: string, role: Role): Promise<string> {
    const payload = { id: userId, email, role };
    return this.jwtService.signAsync(payload);
  }
}
