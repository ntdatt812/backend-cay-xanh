import { Module } from '@nestjs/common';
import { TreesService } from './trees.service';
import { TreesController } from './trees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tree, TreeSchema } from './schemas/tree.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tree.name, schema: TreeSchema }])],
  controllers: [TreesController],
  providers: [TreesService],
  exports: [TreesService]
})
export class TreesModule { }
