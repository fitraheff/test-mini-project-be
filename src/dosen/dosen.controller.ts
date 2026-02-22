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
import { DosenService } from './dosen.service';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DosenEntity } from './entities/dosen.entity';

@Controller('dosen')
@ApiTags('dosen')
export class DosenController {
  constructor(private readonly dosenService: DosenService) {}

  @Post()
  @ApiCreatedResponse({ type: DosenEntity })
  create(@Body() createDosenDto: CreateDosenDto) {
    return this.dosenService.create(createDosenDto);
  }

  @Get()
  @ApiOkResponse({ type: [DosenEntity] })
  findAll() {
    return this.dosenService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: DosenEntity })
  async findOne(@Param('id') id: string) {
    const dosen = await this.dosenService.findOne(id);
    if (!dosen) {
      throw new NotFoundException('Dosen not found');
    }
    return dosen;
  }

  @Patch(':id')
  @ApiOkResponse({ type: DosenEntity })
  update(@Param('id') id: string, @Body() updateDosenDto: UpdateDosenDto) {
    return this.dosenService.update(id, updateDosenDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: DosenEntity })
  remove(@Param('id') id: string) {
    return this.dosenService.remove(id);
  }
}
