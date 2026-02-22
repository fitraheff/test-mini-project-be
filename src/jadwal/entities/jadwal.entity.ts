import { ApiProperty } from '@nestjs/swagger';
import { Jadwal } from '@prisma/client';
import { MaktulEntity } from 'src/maktul/entities/maktul.entity';

export class JadwalEntity implements Jadwal {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hari: string;

  @ApiProperty()
  jamMulai: Date;

  @ApiProperty()
  jamSelesai: Date;

  @ApiProperty()
  ruangan: string;

  @ApiProperty()
  kode: string;

  // untuk menampilkan data maktul saat response jadwal
  @ApiProperty({ type: MaktulEntity })
  maktul: MaktulEntity;

  // untuk memudahkan assign data dari prisma ke entity
  constructor({ maktul, ...data }: Partial<JadwalEntity>) {
    // assign data jadwal ke entity
    Object.assign(this, data);

    // untuk menampilkan data maktul saat response jadwal
    if (maktul) {
      this.maktul = new MaktulEntity(maktul);
    }
  }

  @ApiProperty()
  nidn: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
