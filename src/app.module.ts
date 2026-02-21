import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { DosenModule } from './dosen/dosen.module';

@Module({
  imports: [PrismaModule, MahasiswaModule, DosenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
