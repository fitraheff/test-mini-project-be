/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Injectable } from '@nestjs/common';
import { CreateMaktulDto } from './dto/create-maktul.dto';
import { UpdateMaktulDto } from './dto/update-maktul.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaktulService {
  constructor(private prisma: PrismaService) {}

  create(createMaktulDto: CreateMaktulDto) {
    return this.prisma.mataKuliah.create({ data: createMaktulDto });
  }

  findAll() {
    return this.prisma.mataKuliah.findMany();
  }

  findOne(id: string) {
    return this.prisma.mataKuliah.findUnique({ where: { kode: id } });
  }

  update(id: string, updateMaktulDto: UpdateMaktulDto) {
    return this.prisma.mataKuliah.update({
      where: { kode: id },
      data: updateMaktulDto,
    });
  }

  remove(id: string) {
    return this.prisma.mataKuliah.delete({ where: { kode: id } });
  }
}
