/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Encrypt } from '../../common/helpers/encrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { Md5 } from 'ts-md5';
import { DateTime } from 'luxon';
import { UserRoles } from './entities/user-role.entity';
import { AssignRoleDto } from './dto/assign-role.dto';
import { IPagination, Role } from '@app/api-interfaces';
import { UserView } from './entities/user-view.entity';
import { UserRefreshToken } from './entities/user-refresh-token.entity';
import { CreateUserRefreshTokenDto } from './dto/create-user-refresh-token.dto';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

  constructor(
    private encrypt: Encrypt,
    private authService: AuthService,
    private config: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRoles)
    private userRoleRepository: Repository<UserRoles>,
    @InjectRepository(UserView)
    private userViewRepository: Repository<UserView>,
    @InjectRepository(UserRefreshToken)
    private userRefreshTokenRepository: Repository<UserRefreshToken>,
  ) { }


  async findRefreshToken(refresh_token: string) {
    return this.userRefreshTokenRepository.findOne({
      refresh_token: refresh_token
    });
  }

  async saveRefreshToken(createUserRefreshTokenDto: CreateUserRefreshTokenDto) {
    await this.userRefreshTokenRepository.save(createUserRefreshTokenDto);
  }

  async create(createUserDto: CreateUserDto) {
    Logger.log(createUserDto);
    try {
      createUserDto.user.password = this.encrypt.hash(createUserDto.user.password);
      const user = await this.userRepository.save({
        ...createUserDto.user,
        verify_code: this._generateRandomToken()
      });

      if (createUserDto.roles == null) {
        //assign default role on user creation
        const role = await this.userRoleRepository.save({
          user_id: user.id_user,
          role: Role.User
        })
      } else {
        const roles = createUserDto.roles.map((e) => {
          return {
            user_id: user.id_user,
            role: e.toLowerCase(),
          }
        })
        const role = await this.userRoleRepository.save(roles)
      }

      //sending verification email
      await this.authService.sendVerificationEmail(createUserDto.user.email, user.verify_code);

      return true;
    } catch (error) {
      return false;
    }
  }

  async findAll(
    options: IPagination
  ) {
    const query = this.userRepository.createQueryBuilder();

    if (options.query != null) {
      query.where({
        fullname: ILike(`%${options.query}%`)
      })
    }

    const paginatedResult = await paginate(query, {
      page: options.page,
      limit: options.limit,
    });

    const paginatedResultWithRoles = paginatedResult.items.map(async (e) => {
      const roles = await this.userRoleRepository.find({
        user_id: e.id_user
      });
      return {
        ...e,
        roles: roles.map((e) => e.role),
      }
    })

    return {
      items: await Promise.all(paginatedResultWithRoles),
      meta: paginatedResult.meta,
    }
  }

  findOneWithPassword(id: number) {
    return this.userRepository.findOne(id);
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  profile(id: number) {
    return this.userViewRepository.findOne({
      where: {
        id_user: id
      }
    });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({
      username: username
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.user.password = this.encrypt.hash(updateUserDto.user.password);
    const updateUser = await this.userRepository.update(id, updateUserDto.user);

    if (updateUserDto.roles) {
      //delete user roles
      await this.userRoleRepository.delete({
        user_id: id,
      });
      //insert new one
      const updateRoles = await this.userRoleRepository.save(
        updateUserDto.roles.map((e) => {
          return {
            user_id: id,
            role: e.toLowerCase(),
          }
        })
      );
    }
  }

  async generateForgotPasswordToken(email: string) {
    const token = this._generateRandomToken();
    await this.userRepository.update({
      email: email,
    }, {
      forgotten_password_code: token,
      forgotten_password_time: DateTime.now().plus({ hours: 2 }).toFormat("yyyy-MM-dd HH:mm"), //token active for 2 hours from now
    })

    //return generated token
    return token;
  }

  async checkForgotPasswordToken(token: string): Promise<any> {
    const find = await this.userRepository.findOne({
      forgotten_password_code: token
    })

    if (find) {
      const currentTime = DateTime.now().toMillis();
      const expiredTime = DateTime.fromJSDate(find.forgotten_password_time).toMillis();
      //check expired token
      if (expiredTime > currentTime) {
        return {
          status: true,
          user_id: find.id_user,
        };
      } else {
        console.log("EXPIRED TIME:" + expiredTime);
        console.log("CURRENT TIME:" + currentTime);
        console.log("Kode expired" + find.forgotten_password_time);
        return {
          status: false,
          user_id: null,
        };
      }
    } else {
      return {
        status: false,
        user_id: null,
      };
    }
  }

  //add role to selected user
  async assignRole(assignRoleDto: AssignRoleDto) {
    return await this.userRoleRepository.save({
      user_id: assignRoleDto.user_id,
      role: assignRoleDto.role
    })
  }

  async getUserRole(user_id: number): Promise<Role[]> {
    const userRoleDB = await this.userRoleRepository.find({
      user_id: user_id
    })

    return userRoleDB.map((e) => {
      return e.role as Role;
    })
  }

  remove(id: number) {
    return this.userRepository.softDelete(id);
  }


  _generateRandomToken() {
    return Md5.hashStr(this.config.get('JWT_SECRET') + Math.random().toString())
  }
}
