/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ResponseError, ResponseSuccess } from '../../common/dto/response.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Role } from '@app/api-interfaces';
import { PaginationDto } from '../../common/dto/pagination-dto';

@ApiTags('Users Module')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = this.userService.create(createUserDto);
      return new ResponseSuccess("Success creating user");
    } catch (error) {
      throw new ResponseError("Failed to create user", error);
    }
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('assign-role')
  async assignRole(
    @Body() assignRoleDto: AssignRoleDto
  ) {
    try {
      this.userService.assignRole(assignRoleDto)
      return new ResponseSuccess('Assign role success');
    } catch (error) {
      throw new ResponseError('Assign role failed, reason:' + error);
    }
  }

  @Get('profile')
  async getProfile(
    @Request() req: any
  ) {
    const profile = await this.userService.profile(req.user.id_user);
    return new ResponseSuccess("Profile user", profile)
  }

  @Roles(Role.Admin)
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ) {
    const users = await this.userService.findAll(paginationDto);
    return new ResponseSuccess("Data user", users);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return new ResponseSuccess("User", user);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.user.password == "") {
        delete updateUserDto.user.password;
      }
      const updated = await this.userService.update(+id, updateUserDto);
      return new ResponseSuccess("User updated successfully");
    } catch (error) {
      return new ResponseError("Failed to update user", error);
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const removeUser = await this.userService.remove(+id);
      return new ResponseSuccess("User removed successfully");
    } catch (error) {
      return new ResponseError("Failed to remove user", error);
    }
  }
}
