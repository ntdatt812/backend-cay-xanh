import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TreesService } from './trees.service';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('trees')
export class TreesController {
  constructor(private readonly treesService: TreesService) { }

  @Post()
  create(@Body() createTreeDto: CreateTreeDto, @User() user: IUser) {
    return this.treesService.create(createTreeDto, user);
  }

  @Get()
  @ResponseMessage("Fetch list tree with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.treesService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get('/all')
  @ResponseMessage("Fetch all trees without pagination")
  findAllAll(@Query() qs: string) {
    return this.treesService.findAllAll(qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.treesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTreeDto: UpdateTreeDto,
    @User() user: IUser
  ) {
    return this.treesService.update(id, updateTreeDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser

  ) {
    return this.treesService.remove(id, user);
  }

  @Public()
  @Post('/dashboard')
  @ResponseMessage("Dashboard quản lý cây xanh")
  dashboard() {
    return this.treesService.getDashboardQLCX();
  }
}
