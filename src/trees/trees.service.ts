import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tree, TreeDocument } from './schemas/tree.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class TreesService {

  constructor(
    @InjectModel(Tree.name) private treeModel: SoftDeleteModel<TreeDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) { }

  async create(createTreeDto: CreateTreeDto, user: IUser) {
    const duongkinh = (createTreeDto.chuvi / Math.PI).toFixed(2);

    return this.treeModel.create({
      ...createTreeDto,
      duongkinh,
      history: [
        {
          ...createTreeDto,
          createdBy: {
            _id: user._id,
            email: user.email,
            name: user.name,
          }
        }
      ],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
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

    // Lọc theo khu vực nếu có
    if (filter.khuvuc) {
      const khuVucFilter = Array.isArray(filter.khuvuc) ? { $in: filter.khuvuc } : filter.khuvuc;
      conditions.push({ khuvuc: khuVucFilter });
    }

    if (filter.duongkinh) {
      let values = filter.duongkinh;

      if (typeof values === "object" && values.$in) {
        values = values.$in;
      }

      values = Array.isArray(values) ? values : [values];

      const duongKinhConditions = [];

      values.forEach((value) => {
        if (value === "0-20") duongKinhConditions.push({ duongkinh: { $gte: 0, $lte: 20 } });
        else if (value === "21-50") duongKinhConditions.push({ duongkinh: { $gt: 20, $lte: 50 } });
        else if (value === "50+") duongKinhConditions.push({ duongkinh: { $gt: 50 } });
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

  async update(_id: string, updateTreeDto: UpdateTreeDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("Not found tree");
    }

    const {
      chieucao, chuvi, hientrang, hinhanh,
      khuvuc, lat, lng, mota, namtrong,
      sohieu, tencayxanh, nuoc, phan, saubenh, history
    } = updateTreeDto;

    const duongkinh = parseFloat((chuvi / Math.PI).toFixed(2));

    return this.treeModel.updateOne(
      { _id },
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
        nuoc,
        phan,
        saubenh,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            chieucao,
            duongkinh,
            chuvi,
            hinhanh,
            nuoc,
            phan,
            saubenh,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
              name: user.name,
            },
          },
        },
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

  async getDashboardQLCX() {
    const totalTreesAgg = await this.treeModel.aggregate([
      { $match: { isDeleted: false } },
      { $count: 'total' }
    ]);
    const totalTrees = totalTreesAgg[0]?.total || 0;

    const diameterAgg = await this.treeModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $facet: {
          '0-20': [
            { $match: { duongkinh: { $gte: 0, $lte: 20 } } },
            { $count: 'count' }
          ],
          '21-50': [
            { $match: { duongkinh: { $gt: 20, $lte: 50 } } },
            { $count: 'count' }
          ],
          '50+': [
            { $match: { duongkinh: { $gt: 50 } } },
            { $count: 'count' }
          ]
        }
      }
    ]);


    const treeDiameter = {
      'cayLoai1': diameterAgg[0]['0-20'][0]?.count || 0,
      'cayLoai2': diameterAgg[0]['21-50'][0]?.count || 0,
      'cayLoai3': diameterAgg[0]['50+'][0]?.count || 0
    };

    const uniqueRegionsAgg = await this.treeModel.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$khuvuc' } },
      { $count: 'total' }
    ]);
    const uniqueRegions = uniqueRegionsAgg[0]?.total || 0;

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const newTreesAgg = await this.treeModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: fiveDaysAgo }
        }
      },
      { $count: 'newTrees' }
    ]);
    const newTrees = newTreesAgg[0]?.newTrees || 0;

    return {
      totalTrees,
      treeDiameter,
      uniqueRegions,
      newTrees
    };
  }
}
