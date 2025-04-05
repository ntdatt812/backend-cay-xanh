import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class TasksService {

  constructor(
    @InjectModel(Task.name)
    private taskModel: SoftDeleteModel<TaskDocument>
  ) { }

  async create(createTaskDto: CreateTaskDto, user: IUser) {
    const { title, description, assignedTo } = createTaskDto;
    const { _id, email, name } = user;
    const newTask = await this.taskModel.create({
      title, description, assignedTo,
      status: "PENDING",
      createdBy: {
        _id, email, name
      }
    })
    return {
      _id: newTask?._id,
      createdAt: newTask?.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.taskModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.taskModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found tree with ${id}`
    }
    return this.taskModel.findById(id)
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: IUser) {
    const updated = await this.taskModel.updateOne(
      { _id: id },
      {
        ...updateTaskDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.taskModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )

    return this.taskModel.softDelete(
      { _id: id },
    );
  }

  async findByUserId(userId: string, currentPage: number, limit: number, qs: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return `Not found tasks for user with ID ${userId}`;
    }

    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    // Lọc theo userId
    filter.assignedTo = userId;

    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.taskModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.taskModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

}
