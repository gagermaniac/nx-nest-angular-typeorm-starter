import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SubscribeNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    fcmToken: string;
}