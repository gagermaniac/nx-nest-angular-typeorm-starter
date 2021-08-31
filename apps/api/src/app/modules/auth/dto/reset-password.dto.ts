import { ApiProperty } from '@nestjs/swagger';
import { IResetPassword } from '@app/api-interfaces';

export class ResetPasswordDto implements IResetPassword {
    @ApiProperty()
    token: string;
    @ApiProperty()
    new_password: string;
}