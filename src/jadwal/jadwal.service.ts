import { Injectable } from '@nestjs/common';
import { CreateJadwalDto } from './dto/create-jadwal.dto';
import { UpdateJadwalDto } from './dto/update-jadwal.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JadwalService {
  constructor(private prisma: PrismaService) {}

  create(createJadwalDto: CreateJadwalDto) {
    return this.prisma.jadwal.create({ data: createJadwalDto });
  }

  findAll() {
    return this.prisma.jadwal.findMany();
  }

  findOne(id: string) {
    return this.prisma.jadwal.findUnique({
      where: { id },
      include: {
        dosen: true,
        maktul: true,
      },
    });
  }

  update(id: string, updateJadwalDto: UpdateJadwalDto) {
    return this.prisma.jadwal.update({ where: { id }, data: updateJadwalDto });
  }

  remove(id: string) {
    return this.prisma.jadwal.delete({ where: { id } });
  }
}
