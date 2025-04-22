
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

    @Prop()
    duongkinh: number;

    @Prop()
    chuvi: number;

    @Prop()
    nuoc: string;

    @Prop()
    phan: string;

    @Prop()
    saubenh: string;

    // @Prop({ type: Object })
    // loaicay: {
    //     _id: mongoose.Schema.Types.ObjectId,
    //     tenloaicay: string
    // };

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        chieucao: number;
        duongkinh: number;
        chuvi: number;
        hinhanh: string;
        nuoc: string;
        phan: string;
        saubenh: string;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
            name: string;
        };
    }[];


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
