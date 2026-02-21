import { Module } from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { MahasiswaController } from './mahasiswa.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [MahasiswaController],
  providers: [MahasiswaService],
  imports: [PrismaModule],
})
export class MahasiswaModule {}
