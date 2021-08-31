import { ApiProperty } from '@nestjs/swagger';
import { IRegister } from '@app/api-interfaces';

export class RegisterDto implements IRegister {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    fullname: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;
}