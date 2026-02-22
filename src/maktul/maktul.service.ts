import { Injectable } from '@nestjs/common';
import { CreateMaktulDto } from './dto/create-maktul.dto';
import { UpdateMaktulDto } from './dto/update-maktul.dto';
import { PrismaService } from '../prisma/prisma.service';
import { generateMataKuliahKode } from '../common/helpers/id-generator';

@Injectable()
export class MaktulService {
  constructor(private prisma: PrismaService) {}

  async create(createMaktulDto: CreateMaktulDto) {
    // Auto-generate kode
    const kode = await generateMataKuliahKode(this.prisma);

    return this.prisma.mataKuliah.create({
      data: {
        kode,
        nama: createMaktulDto.nama,
        sks: createMaktulDto.sks,
        semester: createMaktulDto.semester,
      },
    });
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
