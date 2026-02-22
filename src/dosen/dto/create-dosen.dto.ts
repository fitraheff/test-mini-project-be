import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDosenDto {
  // @IsOptional()
  // @IsString()
  // @MaxLength(20, { message: 'NIDN tidak boleh lebih dari 20 karakter' })
  // @MinLength(5, { message: 'NIDN tidak boleh kurang dari 5 karakter' })
  // @ApiProperty({
  //   description: 'NIDN (optional, akan auto-generate jika tidak ada)',
  //   example: 'NIDN0001',
  //   required: false,
  // })
  // nidn?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'Nama dosen tidak boleh lebih dari 255 karakter' })
  @MinLength(3, { message: 'Nama dosen tidak boleh kurang dari 3 karakter' })
  @ApiProperty()
  nama: string;
}
