/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MaktulService } from './maktul.service';
import { CreateMaktulDto } from './dto/create-maktul.dto';
import { UpdateMaktulDto } from './dto/update-maktul.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MaktulEntity } from './entities/maktul.entity';

@Controller('maktul')
@ApiTags('maktul')
export class MaktulController {
  constructor(private readonly maktulService: MaktulService) {}

  @Post()
  @ApiCreatedResponse({ type: MaktulEntity })
  create(@Body() createMaktulDto: CreateMaktulDto) {
    return this.maktulService.create(createMaktulDto);
  }

  @Get()
  @ApiOkResponse({ type: [MaktulEntity] })
  findAll() {
    return this.maktulService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: MaktulEntity })
  async findOne(@Param('id') id: string) {
    const maktul = await this.maktulService.findOne(id);
    if (!maktul) {
      throw new NotFoundException('Mata kuliah not found');
    }
    return maktul;
  }

  @Patch(':id')
  @ApiOkResponse({ type: MaktulEntity })
  update(@Param('id') id: string, @Body() updateMaktulDto: UpdateMaktulDto) {
    return this.maktulService.update(id, updateMaktulDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: MaktulEntity })
  remove(@Param('id') id: string) {
    return this.maktulService.remove(id);
  }
}
