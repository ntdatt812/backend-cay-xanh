import { IsEmail, IsNotEmpty } from "class-validator";

//data tranfer object
export class CreateUserDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống' })
    password: string;

    // @IsNotEmpty({ message: 'Role không được để trống' })
    // role: string;

    // @IsNotEmpty({ message: 'Chưa có ảnh avatar' })
    // avatar: string;
}

export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống' })
    password: string;
}