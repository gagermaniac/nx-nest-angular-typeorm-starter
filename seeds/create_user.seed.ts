// /* eslint-disable @typescript-eslint/no-explicit-any */
import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import * as bcrypt from 'bcrypt';
import { UserDto } from '../apps/api/src/app/modules/user/dto/create-user.dto';
import { Role } from '../libs/api-interfaces/src';
import { User } from '../apps/api/src/app/modules/user/entities/user.entity';
import { UserRoles } from '../apps/api/src/app/modules/user/entities/user-role.entity';

const userSeed: UserDto =
{
    id_user: 1,
    fullname: "admin",
    phone: "081923213123",
    email: "admin@admin.com",
    username: "admin@admin.com",
    password: bcrypt.hashSync("12341234", 10),
}

export default class CreateUsers implements Seeder {

    async run(factory: Factory, connection: Connection): Promise<void> {
        await connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(userSeed)
            .execute()

        await connection.createQueryBuilder()
            .insert()
            .into(UserRoles)
            .values({ role: Role.Admin, user_id: 1 })
            .execute();
    }

}
