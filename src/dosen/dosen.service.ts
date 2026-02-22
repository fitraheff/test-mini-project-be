import { Injectable } from '@nestjs/common';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';
import { PrismaService } from '../prisma/prisma.service';
import { generateNIDN } from '../common/helpers/id-generator';

@Injectable()
export class DosenService {
  constructor(private prisma: PrismaService) {}

  async create(createDosenDto: CreateDosenDto) {
    // Auto-generate NIDN
    const nidn = await generateNIDN(this.prisma);

    return this.prisma.dosen.create({
      data: {
        nidn,
        nama: createDosenDto.nama,
      },
    });
  }

  findAll() {
    return this.prisma.dosen.findMany();
  }

  findOne(id: string) {
    return this.prisma.dosen.findUnique({ where: { nidn: id } });
  }

  update(id: string, updateDosenDto: UpdateDosenDto) {
    return this.prisma.dosen.update({
      where: { nidn: id },
      data: updateDosenDto,
    });
  }

  remove(id: string) {
    return this.prisma.dosen.delete({ where: { nidn: id } });
  }
}
