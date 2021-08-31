import { ApiProperty } from "@nestjs/swagger";

export class CreateUserRefreshTokenDto {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    refresh_token: string;

    @ApiProperty()
    refresh_token_expires: Date;
}