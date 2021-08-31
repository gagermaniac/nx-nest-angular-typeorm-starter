import { ApiProperty } from '@nestjs/swagger';
import { IAssignRole, Role } from '@app/api-interfaces';

export class AssignRoleDto implements IAssignRole {
    @ApiProperty()
    user_id: number;
    @ApiProperty()
    role: Role;
}