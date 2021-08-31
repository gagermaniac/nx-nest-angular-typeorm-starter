import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refreshtoken") {
    constructor(private userService: UserService, private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: config.get<string>('JWT_SECRET'),
            passReqToCallback: true
        });
    }

    async validate(req, payload: any) {
        const user = await this.userService.findOne(payload.id_user);
        if (!user) {
            throw new UnauthorizedException();
        }

        const refreshToken = await this.userService.findRefreshToken(req.body.refresh_token);
        if (refreshToken == null) {
            throw new UnauthorizedException();
        }

        if (new Date() > new Date(refreshToken.refresh_token_expires)) {
            throw new UnauthorizedException();
        }

        return { id_user: payload.id_user, username: payload.username, roles: payload.roles };
    }
}