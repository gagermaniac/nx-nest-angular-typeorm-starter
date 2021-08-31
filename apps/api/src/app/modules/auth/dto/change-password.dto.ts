import { ApiProperty } from '@nestjs/swagger';
import { IChangePassword } from '@app/api-interfaces';

export class ChangePasswordDto implements IChangePassword {
    @ApiProperty()
    old_password: string;
    @ApiProperty()
    new_password: string;
}