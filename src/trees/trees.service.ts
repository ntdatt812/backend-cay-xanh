import { Injectable } from '@nestjs/common';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tree, TreeDocument } from './schemas/tree.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class TreesService {

  constructor(
    @InjectModel(Tree.name)
    private treeModel: SoftDeleteModel<TreeDocument>) { }

  create(createTreeDto: CreateTreeDto) {
    return this.treeModel.create({ ...createTreeDto })
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
