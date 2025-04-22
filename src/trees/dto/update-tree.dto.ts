import { PartialType } from '@nestjs/mapped-types';
import { CreateTreeDto } from './create-tree.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class UpdatedBy {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;
}

class History {
    @IsNotEmpty()
    chieucao: number;

    @IsNotEmpty()
    duongkinh: number;

    @IsNotEmpty()
    chuvi: number;

    @IsNotEmpty()
    hinhanh: string;

    @IsNotEmpty()
    nuoc: string;

    @IsNotEmpty()
    phan: string;

    @IsNotEmpty()
    saubenh: string;

    @IsNotEmpty()
    updatedAt: Date;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => UpdatedBy)
    updatedBy: UpdatedBy;
}

export class UpdateTreeDto extends PartialType(CreateTreeDto) {
    // @IsNotEmpty({ message: 'history không được để trống', })
    // @IsArray({ message: 'history có định dạng là array', })
    @ValidateNested()
    @Type(() => History)
    history: History[];
}
