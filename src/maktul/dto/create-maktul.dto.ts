/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMaktulDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  kode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  nama: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sks: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  semester: number;
}
