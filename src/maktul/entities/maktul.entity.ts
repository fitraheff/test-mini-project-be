import { MataKuliah } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MaktulEntity implements MataKuliah {
  @ApiProperty()
  kode: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  sks: number;

  @ApiProperty()
  semester: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
