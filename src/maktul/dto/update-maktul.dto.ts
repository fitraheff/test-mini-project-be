import { PartialType } from '@nestjs/swagger';
import { CreateMaktulDto } from './create-maktul.dto';

export class UpdateMaktulDto extends PartialType(CreateMaktulDto) {}
