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
  async create(@Body() createMaktulDto: CreateMaktulDto) {
    return new MaktulEntity(await this.maktulService.create(createMaktulDto));
  }

  @Get()
  @ApiOkResponse({ type: [MaktulEntity] })
  async findAll() {
    const maktul = await this.maktulService.findAll();
    return maktul.map((m) => new MaktulEntity(m));
  }

  @Get(':id')
  @ApiOkResponse({ type: MaktulEntity })
  async findOne(@Param('id') id: string) {
    const maktul = await this.maktulService.findOne(id);
    if (!maktul) {
      throw new NotFoundException('Mata kuliah not found');
    }
    return new MaktulEntity(maktul);
  }

  @Patch(':id')
  @ApiOkResponse({ type: MaktulEntity })
  async update(
    @Param('id') id: string,
    @Body() updateMaktulDto: UpdateMaktulDto,
  ) {
    return new MaktulEntity(
      await this.maktulService.update(id, updateMaktulDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: MaktulEntity })
  async remove(@Param('id') id: string) {
    return new MaktulEntity(await this.maktulService.remove(id));
  }
}
