import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateJadwalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  hari: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  jamMulai: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  jamSelesai: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  ruangan: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  kode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nidn: string;
}
