import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMahasiswaDto {
  // @IsOptional()
  // @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  // @ApiProperty({
  //   description: 'NIM (optional, akan auto-generate jika tidak ada)',
  //   example: '202600001',
  //   required: false,
  // })
  // nim?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty()
  nama: string;
}
