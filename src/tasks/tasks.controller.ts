import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ResponseMessage("Create new a task ")
  create(@Body() createTaskDto: CreateTaskDto, @User() user: IUser) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @ResponseMessage("Fetch all task with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,) {
    return this.tasksService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch one task by id")
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Get('user/:userId')
  @ResponseMessage("Fetch all task by id employ")
  getTasksByUser(
    @Param('userId') userId: string,
    @Query('currentPage') currentPage: number = 1,
    @Query('limit') limit: number = 10,
    @Query() qs: string
  ) {
    return this.tasksService.findByUserId(userId, currentPage, limit, qs);
  }

  @Patch(':id')
  @ResponseMessage("Update task")
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @User() user: IUser) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete task ")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.tasksService.remove(id, user);
  }
}
