import { IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
    // @IsOptional()
    // @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    // status?: string;

    @IsNotEmpty({ message: "Nội dung báo cáo không được để trống!" })
    report: string;


    @IsNotEmpty({ message: "Hình ảnh báo cáo không được để trống!" })
    imageUrl: string;


    @IsNotEmpty({ message: "Trạng thái báo cáo không được để trống!" })
    status: string;
}