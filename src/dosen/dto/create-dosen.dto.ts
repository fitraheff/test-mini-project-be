import { ApiProperty } from '@nestjs/swagger';

export class CreateDosenDto {
  @ApiProperty()
  nidn: string;

  @ApiProperty()
  nama: string;
}
