import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TreesService } from './trees.service';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('trees')
export class TreesController {
  constructor(private readonly treesService: TreesService) { }

  @Post()
  create(@Body() createTreeDto: CreateTreeDto, @User() user: IUser) {
    console.log("Check user: ", user)
    return this.treesService.create(createTreeDto, user);
  }

  @Get()
  findAll() {
    return this.treesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTreeDto: UpdateTreeDto) {
    return this.treesService.update(+id, updateTreeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treesService.remove(+id);
  }
}
