import { Module } from '@nestjs/common';
import { JadwalService } from './jadwal.service';
import { JadwalController } from './jadwal.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [JadwalController],
  providers: [JadwalService],
  imports: [PrismaModule],
})
export class JadwalModule {}
