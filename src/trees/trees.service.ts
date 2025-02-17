import { Injectable } from '@nestjs/common';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tree, TreeDocument } from './schemas/tree.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';

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

  findAll() {
    return `This action returns all trees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tree`;
  }

  update(id: number, updateTreeDto: UpdateTreeDto) {
    return `This action updates a #${id} tree`;
  }

  remove(id: number) {
    return `This action removes a #${id} tree`;
  }
}
