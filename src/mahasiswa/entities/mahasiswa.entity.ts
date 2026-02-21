import { ApiProperty } from '@nestjs/swagger';
import { Mahasiswa } from '@prisma/client';

export class MahasiswaEntity implements Mahasiswa {
  @ApiProperty()
  nim: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
