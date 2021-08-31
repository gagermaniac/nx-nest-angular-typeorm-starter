import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Encrypt } from '../../common/helpers/encrypt';
import { EmailService } from '../../common/services/email.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '8h' },
            })
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, Encrypt, EmailService, JwtStrategy, LocalStrategy, JwtRefreshTokenStrategy],
    exports: [AuthService]
})
export class AuthModule { }
