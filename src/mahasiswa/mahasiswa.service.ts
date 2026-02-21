/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Injectable } from '@nestjs/common';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) {}

  create(createMahasiswaDto: CreateMahasiswaDto) {
    return this.prisma.mahasiswa.create({ data: createMahasiswaDto });
  }

  findAll() {
    return this.prisma.mahasiswa.findMany();
  }

  findOne(id: string) {
    return this.prisma.mahasiswa.findUnique({ where: { nim: id } });
  }

  update(id: string, updateMahasiswaDto: UpdateMahasiswaDto) {
    return this.prisma.mahasiswa.update({
      where: { nim: id },
      data: updateMahasiswaDto,
    });
  }

  remove(id: string) {
    return this.prisma.mahasiswa.delete({ where: { nim: id } });
  }
}
