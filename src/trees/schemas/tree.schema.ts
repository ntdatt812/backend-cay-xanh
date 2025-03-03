
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TreeDocument = HydratedDocument<Tree>;

@Schema({ timestamps: true })
export class Tree {
    @Prop()
    tencayxanh: string;

    @Prop()
    khuvuc: string;

    @Prop()
    lat: string;

    @Prop()
    lng: string;

    @Prop()
    chieucao: number;

    @Prop()
    namtrong: number;

    @Prop()
    mota: string;

    @Prop()
    hinhanh: string;

    @Prop()
    sohieu: string;

    @Prop()
    hientrang: string;

    // @Prop({ type: Object })
    // loaicay: {
    //     _id: mongoose.Schema.Types.ObjectId,
    //     tenloaicay: string
    // };

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const TreeSchema = SchemaFactory.createForClass(Tree);
