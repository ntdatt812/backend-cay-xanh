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
    const { chieucao, chuvi, hientrang,
      hinhanh, khuvuc, lat, lng, mota, namtrong,
      sohieu, tencayxanh } = createTreeDto;

    const duongkinh = chuvi / Math.PI;

    return this.treeModel.create({
      chieucao,
      chuvi,
      duongkinh,
      hientrang,
      hinhanh,
      khuvuc,
      lat,
      lng,
      mota,
      namtrong,
      sohieu,
      tencayxanh,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
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
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const conditions = [];

    if (filter.khuvuc) {
      const khuVucFilter = Array.isArray(filter.khuvuc) ? { $in: filter.khuvuc } : filter.khuvuc;
      conditions.push({ khuvuc: khuVucFilter });
    }

    if (filter.duongkinh) {
      const values = Array.isArray(filter.duongkinh) ? filter.duongkinh : [filter.duongkinh];

      const duongKinhConditions = [];
      values.forEach((value) => {
        if (value === "0-20") duongKinhConditions.push({ duongkinh: { $lte: 20 } });
        if (value === "20-50") duongKinhConditions.push({ duongkinh: { $gt: 20, $lte: 50 } });
        if (value === "50+") duongKinhConditions.push({ duongkinh: { $gt: 50 } });
      });

      if (duongKinhConditions.length > 0) {
        conditions.push({ $or: duongKinhConditions });
      }
    }

    const finalFilter = conditions.length > 0 ? { $and: conditions } : {};

    const result = await this.treeModel
      .find(finalFilter)
      .sort(sort as any)
      .select(projection)
      .populate(population)
      .exec();

    return result;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found tree with ${id}`
    }
    return this.treeModel.findById(id)
  }

  async update(id: string, updateTreeDto: UpdateTreeDto, user: IUser) {

    const { chieucao, chuvi, hientrang,
      hinhanh, khuvuc, lat, lng, mota, namtrong,
      sohieu, tencayxanh } = updateTreeDto;

    const duongkinh = chuvi / Math.PI;

    return this.treeModel.updateOne(
      { _id: id },
      {
        chieucao,
        chuvi,
        duongkinh,
        hientrang,
        hinhanh,
        khuvuc,
        lat,
        lng,
        mota,
        namtrong,
        sohieu,
        tencayxanh,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      });
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
