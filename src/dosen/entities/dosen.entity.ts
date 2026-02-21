import { ApiProperty } from '@nestjs/swagger';
import { Dosen } from '@prisma/client';

export class DosenEntity implements Dosen {
  @ApiProperty()
  nidn: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
