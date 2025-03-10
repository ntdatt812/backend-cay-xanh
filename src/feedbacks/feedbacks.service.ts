import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class FeedbacksService {

  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: SoftDeleteModel<FeedbackDocument>
  ) { }

  async create(createFeedbackDto: CreateFeedbackDto, user: IUser) {
    const { fullName, content, hinhanh, phoneNumber, title, treeId, studentCode, emailFeedback } = createFeedbackDto;
    const { _id, email } = user;

    const newFeedback = await this.feedbackModel.create({
      fullName, phoneNumber, content, title,
      studentCode, emailFeedback, hinhanh, treeId,
      status: "PENDING",
      userId: _id,
      createdBy: { _id, email },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email,
            name: user.name,
          }
        }
      ]
    })

    return {
      _id: newFeedback?._id,
      createdAt: newFeedback?.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.feedbackModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.feedbackModel.find(filter)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("not found resume")
    }

    return await this.feedbackModel.findById(id);
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found resume")
    }

    const updated = await this.feedbackModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
          name: user.name
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email,
              name: user.name
            }
          }
        }
      });
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.feedbackModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.feedbackModel.softDelete({
      _id: id
    })
  }

  async findByUsers(user: IUser) {
    return await this.feedbackModel.find({
      userId: user._id
    })
  }
}
