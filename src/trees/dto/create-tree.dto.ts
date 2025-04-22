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

    @IsNotEmpty({ message: 'Số hiệu không được để trống' })
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

    @IsNotEmpty({ message: 'Hiện trạng không được để trống' })
    hientrang: string;

    @IsNotEmpty({ message: 'Chu vi không được để trống' })
    chuvi: number;

    @IsNotEmpty({ message: 'Nước không được để trống' })
    nuoc: string;

    @IsNotEmpty({ message: 'Phân không được để trống' })
    phan: string;

    @IsNotEmpty({ message: 'Sâu bệnh không được để trống' })
    saubenh: string;


    // @IsNotEmptyObject()
    // @IsObject()
    // @ValidateNested()
    // @Type(() => LoaiCay)
    // loaicay: LoaiCay;

}
