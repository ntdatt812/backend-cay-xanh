import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";

//data tranfer object
export class CreateUserDto {
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống' })
    password: string;

    name: string;

    address: string;
}
