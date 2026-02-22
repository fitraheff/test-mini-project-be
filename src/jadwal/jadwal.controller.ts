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
import { JadwalService } from './jadwal.service';
import { CreateJadwalDto } from './dto/create-jadwal.dto';
import { UpdateJadwalDto } from './dto/update-jadwal.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JadwalEntity } from './entities/jadwal.entity';

@Controller('jadwal')
@ApiTags('jadwal')
export class JadwalController {
  constructor(private readonly jadwalService: JadwalService) {}

  @Post()
  @ApiCreatedResponse({ type: JadwalEntity })
  async create(@Body() createJadwalDto: CreateJadwalDto) {
    return new JadwalEntity(await this.jadwalService.create(createJadwalDto));
  }

  @Get()
  @ApiOkResponse({ type: [JadwalEntity] })
  async findAll() {
    const jadwal = await this.jadwalService.findAll();
    return jadwal.map((jadwal) => new JadwalEntity(jadwal));
  }

  @Get(':id')
  @ApiOkResponse({ type: JadwalEntity })
  async findOne(@Param('id') id: string) {
    const jadwal = await this.jadwalService.findOne(id);
    if (!jadwal) {
      throw new NotFoundException('Jadwal not found');
    }
    return new JadwalEntity(jadwal);
  }

  @Patch(':id')
  @ApiOkResponse({ type: JadwalEntity })
  async update(
    @Param('id') id: string,
    @Body() updateJadwalDto: UpdateJadwalDto,
  ) {
    return new JadwalEntity(
      await this.jadwalService.update(id, updateJadwalDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: JadwalEntity })
  async remove(@Param('id') id: string) {
    return new JadwalEntity(await this.jadwalService.remove(id));
  }
}
