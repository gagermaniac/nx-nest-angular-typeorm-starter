import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@app/api-interfaces';

export class UserDto {
    id_user?: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    fullname: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    //optional
    forgotten_password_code?: string;
    forgotten_password_time?: string;

    refreshtoken?: string;
    refreshtokenexpires?: string;
}

export class CreateUserDto {

    @ApiProperty()
    user: UserDto;

    @ApiProperty()
    roles?: Role[];

}

