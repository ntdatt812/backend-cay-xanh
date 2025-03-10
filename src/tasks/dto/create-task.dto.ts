import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateTaskDto {

    @IsNotEmpty({ message: "Nội dung công việc không được để trống!" })
    @IsString()
    title: string;

    @IsString()
    description?: string;

    @IsNotEmpty({ message: "Id nhân viên không được để trống!" })
    @IsMongoId({ message: "Id của nhân viên không hợp lệ!" })
    assignedTo: mongoose.Schema.Types.ObjectId; // ID của nhân viên được giao

}
