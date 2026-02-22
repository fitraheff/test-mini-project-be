import { MataKuliah } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class MaktulEntity implements MataKuliah {
  // untuk memudahkan assign data dari prisma ke entity
  constructor(partial: Partial<MaktulEntity>) {
    Object.assign(this, partial);
  }
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

  // untuk menyembunyikan field updatedAt saat response
  @Exclude()
  updatedAt: Date;
}
