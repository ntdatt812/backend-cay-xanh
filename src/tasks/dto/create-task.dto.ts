import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    assignedTo: string; // ID của nhân viên được giao

}
