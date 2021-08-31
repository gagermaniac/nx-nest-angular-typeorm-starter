import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserRoles {
    @PrimaryGeneratedColumn()
    id_user_role: number;

    @Column()
    user_id: number;

    @Column()
    role: string;

    @ManyToOne(() => User, user => user.roles, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: "user_id"
    })
    user: User;

}