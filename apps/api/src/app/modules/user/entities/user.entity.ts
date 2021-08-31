import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { UserRoles } from "./user-role.entity";

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column({
        unique: true
    })
    username: string;

    @Column()
    fullname: string;

    @Column()
    phone: string;

    @Column({
        nullable: true,
        unique: true,
    })
    email: string;

    @Column({
    })
    password: string;

    @Column({
        nullable: true,
    })
    forgotten_password_code: string;

    @Column({
        nullable: true,
    })
    forgotten_password_time: Date;

    @Column({
        default: null,
        nullable: true,
    })
    refreshtoken: string;

    @Column({
        nullable: true,
    })
    refreshtokenexpires: string;

    @Column({
        default: "",
    })
    verify_code: string;

    @Column({
        default: false
    })
    verified: boolean;

    @OneToOne(() => Profile, profile => profile.user)
    profile: Profile;

    @CreateDateColumn()
    create_date: Date;

    @UpdateDateColumn()
    update_date: Date;

    @DeleteDateColumn()
    delete_date: Date;

    @OneToMany(() => UserRoles, userRole => userRole.user)
    roles: UserRoles[];
}
