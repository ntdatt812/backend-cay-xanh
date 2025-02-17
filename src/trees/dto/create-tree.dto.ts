import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";

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
}
