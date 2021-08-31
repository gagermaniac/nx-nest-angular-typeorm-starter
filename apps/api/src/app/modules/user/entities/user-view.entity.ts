import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    expression: (conn) => conn.createQueryBuilder()
        .select([
            "u.id_user as id_user",
            "u.fullname as fullname",
            "u.phone as phone",
        ])
        .from('users', 'u')
})
export class UserView {
    @ViewColumn()
    id_user: number;

    @ViewColumn()
    fullname: string;

    @ViewColumn()
    phone: string;
}