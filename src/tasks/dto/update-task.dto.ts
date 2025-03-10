import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateTaskDto {
    // @IsOptional()
    // @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    // status?: string;

    @IsOptional()
    @IsString()
    report?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}