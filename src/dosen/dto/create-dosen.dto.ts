/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDosenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(5)
  nidn: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @ApiProperty()
  nama: string;
}
