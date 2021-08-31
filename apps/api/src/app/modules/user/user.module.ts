import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Encrypt } from '../../common/helpers/encrypt';
import { UserRoles } from './entities/user-role.entity';
import { Profile } from './entities/profile.entity';
import { UserView } from './entities/user-view.entity';
import { UserRefreshToken } from './entities/user-refresh-token.entity';
import { EmailService } from '../../common/services/email.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRoles,
      Profile,
      // ProfileView
      UserView,
      UserRefreshToken
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, Encrypt, EmailService],
  exports: [UserService]
})
export class UserModule { }
