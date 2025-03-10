
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tree } from 'src/trees/schemas/tree.schema';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback {
    @Prop()
    fullName: string;

    @Prop()
    studentCode?: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    emailFeedback: string;

    @Prop()
    status: string;

    @Prop()
    title: string;

    @Prop()
    content: string; // nội dung

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tree.name })
    treeId: mongoose.Schema.Types.ObjectId;

    @Prop()
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    hinhanh: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
            name: string;
        };
    }[]


    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string,
        name: string;
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string,
        name: string
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

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
