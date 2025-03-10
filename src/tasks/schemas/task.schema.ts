
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    assignedTo: mongoose.Schema.Types.ObjectId; // ID của nhân viên được giao

    @Prop({ enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], default: 'PENDING' })
    status: string;

    @Prop()
    report?: string; // Nội dung báo cáo công việc

    @Prop()
    imageUrl?: string; // Ảnh báo cáo công việc


    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string,
        name: string
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

export const TaskSchema = SchemaFactory.createForClass(Task);
