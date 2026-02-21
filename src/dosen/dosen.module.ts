import { Module } from '@nestjs/common';
import { DosenService } from './dosen.service';
import { DosenController } from './dosen.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [DosenController],
  providers: [DosenService],
  imports: [PrismaModule],
})
export class DosenModule {}
