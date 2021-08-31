/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseSuccess } from "../../common/dto/response.dto";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtRefreshTokenGuard } from "./guard/jwt-refreshtoken.guard";
import { JwtAuthGuard } from "./guard/jwt.guard";
import { LocalAuthGuard } from "./guard/local.guard";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @Body() loginDto: LoginDto,
        @Request() req: any
    ) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtRefreshTokenGuard)
    @ApiBearerAuth()
    @Post('refresh-token')
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Request() req: any
    ) {
        return await this.authService.login(req.user);
    }

    @Post('register')
    async register(
        @Body() registerDto: RegisterDto
    ) {
        const checkUsername = await this.userService.findByUsername(registerDto.username);
        if (checkUsername == undefined || checkUsername == null) {
            const response = await this.authService.register(registerDto);
            if (response) {
                return new ResponseSuccess('Register success');
            } else {
                throw new HttpException('Register faile, please try again', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new HttpException('Email already used', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('forgot-password')
    forgotPassword(@
        Body('email') email: string
    ) {
        try {
            this.authService.forgotPassword(email);
            return new ResponseSuccess('Email sent');
        } catch (error) {
            throw new HttpException({ message: 'Failed to sent, reason:' + error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        const response = await this.authService.resetPassword(resetPasswordDto);
        if (response.status) {
            return new ResponseSuccess(response.message);
        } else {
            throw new HttpException({
                message: response.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req: any) {
        try {
            const changePassword = await this.authService.changePassword(req.user.id_user, changePasswordDto);
            console.log(changePassword);
            if (changePassword) {
                return new ResponseSuccess('Change password success');
            } else {
                throw new HttpException({
                    message: 'Change password failed'
                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        } catch (error) {
            throw new HttpException({
                message: 'Change password failed, reason:' + error
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}