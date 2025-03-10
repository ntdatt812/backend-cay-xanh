import { Injectable } from '@nestjs/common';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tree, TreeDocument } from './schemas/tree.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class TreesService {

  constructor(
    @InjectModel(Tree.name)
    private treeModel: SoftDeleteModel<TreeDocument>) { }

  create(createTreeDto: CreateTreeDto, user: IUser) {
    return this.treeModel.create(
      {
        ...createTreeDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }

    )
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.treeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.treeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
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

  async findAllAll(qs: string) {
    // Sử dụng aqp để phân tích query string (bao gồm filter, sort, projection, population)
    const { filter, sort, projection, population } = aqp(qs);

    // Loại bỏ các thuộc tính phân trang nếu có
    delete filter.current;
    delete filter.pageSize;

    // Truy vấn tất cả các cây theo filter, sort, projection và population (nếu có)
    const result = await this.treeModel.find(filter)
      .sort(sort as any)
      .select(projection)      // Nếu bạn muốn giới hạn các trường trả về, nếu không, có thể bỏ qua
      .populate(population)
      .exec();
    // Trả về danh sách cây (hoặc có thể bọc trong một object meta nếu cần)
    return result;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found tree with ${id}`
    }
    return this.treeModel.findById(id)
  }

  async update(id: string, updateTreeDto: UpdateTreeDto, user: IUser) {
    return await this.treeModel.updateOne(
      { _id: id },
      {
        ...updateTreeDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.treeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )

    return this.treeModel.softDelete(
      { _id: id },
    );
  }
}
