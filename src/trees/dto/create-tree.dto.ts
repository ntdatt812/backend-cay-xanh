import { Type } from "class-transformer";
import { IsEmail, IsEmpty, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";


class LoaiCay {
    @IsNotEmpty({ message: 'Năm trồng không được để trống' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Năm trồng không được để trống' })
    tenloaicay: string
}

//data tranfer object
export class CreateTreeDto {
    @IsNotEmpty({ message: 'Tên cây xanh không được để trống' })
    tencayxanh: string;

    @IsNotEmpty({ message: 'Chiều cao không được để trống' })
    chieucao: number;

    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    mota: string;

    @IsNotEmpty({ message: 'Năm trồng không được để trống' })
    namtrong: number;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => LoaiCay)
    loaicay: LoaiCay;

}
