import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import e, { Response } from 'express';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    //username và pass là 2 tham số thư viện passport ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, avatar } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            avatar,
            role
        };

        const refresh_token = this.createRefreshToken(payload)

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id);

        //set refresh token as cookies
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }

        };
    }

    async register(user: RegisterUserDto) {
        const newUser = await this.usersService.register(user)
        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
        });
        return refresh_token;
    }

    processNewToken = async (refreshToken: string, response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            })

            const user = await this.usersService.findUserByToken(refreshToken);
            if (user) {
                //update refresh token
                const { _id, name, email, role, avatar } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    avatar,
                    role
                };

                const refresh_token = this.createRefreshToken(payload)

                //update user with refresh token
                await this.usersService.updateUserToken(refresh_token, _id.toString());

                //set refresh token as cookies
                response.clearCookie("refresh_token"); // xoá cái cũ
                response.clearCookie("key"); // xoá cái cũ

                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        avatar,
                        role
                    }

                };
            } else {
                throw new BadRequestException("Refresh token không hợp lệ, vui lòng login!")
            }
        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ, vui lòng login!")
        }
    }

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "ok";
    }
}
