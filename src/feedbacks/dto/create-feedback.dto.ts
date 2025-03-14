import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";



export class CreateFeedbackDto {
    @IsNotEmpty({ message: 'Họ tên không được để trống', })
    fullName: string;

    report?: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống', })
    phoneNumber: string;

    @IsNotEmpty({ message: 'Email không được để trống', })
    emailFeedback: string;

    @IsNotEmpty({ message: 'Tiêu đề không được để trống', })
    title: string;

    @IsNotEmpty({ message: 'Nội dung không được để trống', })
    content: string; // nội dung

    @IsNotEmpty({ message: 'treeid nhận không được để trống', })
    @IsMongoId({ message: 'treeid is a mongo id' })
    treeId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Hình ảnh không được để trống', })
    hinhanh: string;
}
