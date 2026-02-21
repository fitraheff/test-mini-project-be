import { Injectable } from '@nestjs/common';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) {}

  create(createMahasiswaDto: CreateMahasiswaDto) {
    return 'This action adds a new mahasiswa';
  }

  findAll() {
    return this.prisma.mahasiswa.findMany();
  }

  findOne(id: string) {
    return this.prisma.mahasiswa.findUnique({ where: { nim: id } });
  }

  update(id: number, updateMahasiswaDto: UpdateMahasiswaDto) {
    return `This action updates a #${id} mahasiswa`;
  }

  remove(id: number) {
    return `This action removes a #${id} mahasiswa`;
  }
}
