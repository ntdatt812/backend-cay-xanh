import { Type } from "class-transformer";
import { IsEmail, IsEmpty, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";


// class LoaiCay {
//     @IsNotEmpty({ message: 'Id loại cây không được để trống' })
//     _id: mongoose.Schema.Types.ObjectId;

//     @IsNotEmpty({ message: 'Tên loại cây không được để trống' })
//     tenloaicay: string
// }

//data tranfer object
export class CreateTreeDto {
    @IsNotEmpty({ message: 'Tên cây xanh không được để trống' })
    tencayxanh: string;

    @IsNotEmpty({ message: 'Khu vực không được để trống' })
    khuvuc: string;

    @IsNotEmpty({ message: 'Chiều cao không được để trống' })
    chieucao: number;

    sohieu: string;

    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    mota: string;

    @IsNotEmpty({ message: 'Năm trồng không được để trống' })
    namtrong: number;

    @IsNotEmpty({ message: 'Toạ độ lat không được để trống' })
    lat: string;

    @IsNotEmpty({ message: 'Toạ độ lng không được để trống' })
    lng: string;

    @IsNotEmpty({ message: 'Chưa tải hình ảnh lên' })
    hinhanh: string;

    hientrang: string;








    // @IsNotEmptyObject()
    // @IsObject()
    // @ValidateNested()
    // @Type(() => LoaiCay)
    // loaicay: LoaiCay;

}
