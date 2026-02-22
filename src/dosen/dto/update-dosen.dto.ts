import { PartialType } from '@nestjs/swagger';
import { CreateDosenDto } from './create-dosen.dto';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateDosenDto extends PartialType(CreateDosenDto) {
  @IsString()
  @MaxLength(255, { message: 'Nama dosen tidak boleh lebih dari 255 karakter' })
  @MinLength(3, { message: 'Nama dosen tidak boleh kurang dari 3 karakter' })
  nama?: string | undefined;
}
