import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackDto } from './create-feedback.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';


class UpdatedBy {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsNotEmpty()
    @IsEmail()
    emailFeedback: string;

    @IsNotEmpty()
    name: string;
}

class History {
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    updatedAt: Date;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => UpdatedBy)
    updatedBy: UpdatedBy
}


export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
    @IsNotEmpty({ message: 'history không được để trống', })
    @IsArray({ message: 'history có định dạng là array', })
    @ValidateNested()
    @Type(() => History)
    history: History[];
}
