import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {UserService} from "../../user/user.service";

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findByUsername(payload.username);

        if (!user.is2FOn) {
            return user;
        }
        if (payload.isTwoFactorAuthenticated) {
            return user;
        }
    }
}