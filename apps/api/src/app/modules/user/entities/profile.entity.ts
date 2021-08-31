import { JoinColumn, OneToOne } from "typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({
    name: "profile"
})
export class Profile {
    @PrimaryGeneratedColumn()
    id_profile: number;

    @Column()
    user_id: number;
    /**
     * relation
     */

    @OneToOne(() => User, user => user.profile,
        {
            onDelete: "CASCADE"
        })
    @JoinColumn({
        name: "user_id"
    })
    user: User;
}