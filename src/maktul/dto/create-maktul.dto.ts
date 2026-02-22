import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMaktulDto {
  // @IsOptional()
  // @IsString()
  // @MinLength(3)
  // @MaxLength(10)
  // @ApiProperty({
  //   description:
  //     'Kode Mata Kuliah (optional, akan auto-generate jika tidak ada)',
  //   example: 'MK0001',
  //   required: false,
  // })
  // kode?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty()
  nama: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  sks: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  semester: number;
}
