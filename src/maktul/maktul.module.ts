import { Module } from '@nestjs/common';
import { MaktulService } from './maktul.service';
import { MaktulController } from './maktul.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [MaktulController],
  providers: [MaktulService],
  imports: [PrismaModule],
})
export class MaktulModule {}
