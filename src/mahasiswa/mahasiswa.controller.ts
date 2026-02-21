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
import { MahasiswaService } from './mahasiswa.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MahasiswaEntity } from './entities/mahasiswa.entity';

@Controller('mahasiswa')
@ApiTags('mahasiswa')
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) {}

  @Post()
  @ApiCreatedResponse({ type: MahasiswaEntity })
  create(@Body() createMahasiswaDto: CreateMahasiswaDto) {
    return this.mahasiswaService.create(createMahasiswaDto);
  }

  @Get()
  @ApiOkResponse({ type: [MahasiswaEntity] })
  findAll() {
    return this.mahasiswaService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: MahasiswaEntity })
  async findOne(@Param('id') id: string) {
    const mahasiswa = await this.mahasiswaService.findOne(id);
    if (!mahasiswa) {
      throw new NotFoundException('Mahasiswa not found');
    }
    return mahasiswa;
  }

  @Patch(':id')
  @ApiOkResponse({ type: MahasiswaEntity })
  update(
    @Param('id') id: string,
    @Body() updateMahasiswaDto: UpdateMahasiswaDto,
  ) {
    return this.mahasiswaService.update(id, updateMahasiswaDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: MahasiswaEntity })
  remove(@Param('id') id: string) {
    return this.mahasiswaService.remove(id);
  }
}
