import { Module } from '@nestjs/common';
import { TreesService } from './trees.service';
import { TreesController } from './trees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tree, TreeSchema } from './schemas/tree.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Tree.name, schema: TreeSchema },
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [TreesController],
  providers: [TreesService],
  exports: [TreesService]
})
export class TreesModule { }
