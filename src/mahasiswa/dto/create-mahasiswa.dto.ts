/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMahasiswaDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty()
  nim: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty()
  nama: string;
}
