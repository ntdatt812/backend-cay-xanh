import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) { }

  @Post()
  @ResponseMessage("Create a new feedback")
  create(@Body() createFeedbackDto: CreateFeedbackDto, @User() user: IUser) {
    return this.feedbacksService.create(createFeedbackDto, user);
  }

  @Post('by-user')
  @ResponseMessage("Get feedback by User")
  getResumesByUser(@User() user: IUser) {
    return this.feedbacksService.findByUsers(user);
  }

  @Get()
  @ResponseMessage("Fetch all feedback with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.feedbacksService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch a feedback by id")
  findOne(@Param('id') id: string) {
    return this.feedbacksService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update status feedback")
  updateStatus(@Param('id') id: string, @Body("status") status: string, @User() user: IUser) {
    return this.feedbacksService.update(id, status, user);
  }
  @Delete(':id')
  @ResponseMessage("Delete a feedback by id")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.feedbacksService.remove(id, user);
  }
}
