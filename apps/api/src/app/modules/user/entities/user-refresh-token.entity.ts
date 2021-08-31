import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserRefreshToken {

    @ManyToOne(() => User, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: 'user_id'
    })
    @Column()
    user_id: number;

    @PrimaryColumn()
    refresh_token: string;

    @Column({
        type: "date"
    })
    refresh_token_expires: Date;

    @CreateDateColumn()
    create_date: Date;

    @UpdateDateColumn()
    update_date: Date;

    @DeleteDateColumn()
    delete_date: Date;
}