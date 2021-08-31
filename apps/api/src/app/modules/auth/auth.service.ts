import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Encrypt } from '../../common/helpers/encrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from '../user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../common/services/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as randtoken from 'rand-token';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private encrypt: Encrypt,
        private jwtService: JwtService,
        private config: ConfigService,
        private emailService: EmailService,
    ) { }

    async generateRefreshToken(userId: string): Promise<string> {
        const refreshToken = randtoken.generate(16);
        const expirydate = new Date();
        expirydate.setDate(expirydate.getDate() + 6);

        await this.userService.saveRefreshToken({
            user_id: parseInt(userId),
            refresh_token: refreshToken,
            refresh_token_expires: expirydate
        });

        return refreshToken
    }

    async validateUser(loginDto: LoginDto): Promise<any> {
        const user = await this.userService.findByUsername(loginDto.username);
        if (user && this.encrypt.compare(loginDto.password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async sendVerificationEmail(email: string, verify_code: string) {
        //sending email to target
        const mailOptions = {
            from: '"no-reply" <' + this.config.get<string>('APP_NAME') + '>',
            to: email, // list of receivers (separated by ,)
            subject: 'Email activation code',
            text: 'Email activation code',
            html: 'Hi! <br>' +
                'Use this code to activate your account <div style="padding:10px;border:solid 1px silver;background:whitesmoke">' + verify_code + '</div> or else ignore this message.'  // html body
        };
        return this.emailService.sendMail(email, mailOptions);
    }

    async login(user: any) {
        const refreshToken = await this.generateRefreshToken(user.id_user);
        const userRole = await this.userService.getUserRole(user.id_user);

        const payload = { username: user.username, id_user: user.id_user, roles: userRole };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
        };
    }

    async register(registerDto: RegisterDto) {
        return this.userService.create({
            user: registerDto
        })
    }

    async forgotPassword(email: string): Promise<boolean> {
        const token = await this.userService.generateForgotPasswordToken(email);

        //sending email to target
        const mailOptions = {
            from: '"no-reply" <' + this.config.get<string>('APP_NAME') + '>',
            to: email, // list of receivers (separated by ,)
            subject: 'Forgot password request',
            text: 'Forgot password request',
            html: 'Hi! <br><br> If you requested to reset your password<br><br>' +
                'Use this code <div style="padding:10px;border:solid 1px silver;background:whitesmoke">' + token + '</div> or else ignore this message.'  // html body
        };
        return this.emailService.sendMail(email, mailOptions);
    }

    async resetPassword(params: ResetPasswordDto) {
        console.log(params);
        const checkToken = await this.userService.checkForgotPasswordToken(params.token);
        if (checkToken.status) {
            try {
                const update = this.userService.update(checkToken.user_id, {
                    user: {
                        password: params.new_password,
                        forgotten_password_time: null,
                        forgotten_password_code: null,
                    } as UserDto
                });
                return {
                    status: true,
                    message: 'Password berhasil diubah',
                }
            } catch (error) {
                return {
                    status: false,
                    message: 'Gagal mengubah password, silahkan coba lagi',
                }
            }
        }
        return {
            status: false,
            message: 'Kode lupa password tidak valid',
        }
    }

    async changePassword(user_id: number, changePasswordDto: ChangePasswordDto) {
        //check old password
        const user = await this.userService.findOneWithPassword(user_id);
        if (user && this.encrypt.compare(changePasswordDto.old_password, user.password)) {
            //change user password
            await this.userService.update(user.id_user, {
                user: {
                    password: changePasswordDto.new_password
                } as UserDto
            })
            return true;
        } else {
            return false;
        }
    }


    async verifyEmail() {
        return;
    }
}
