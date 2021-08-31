import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class LogEntity {
    @PrimaryGeneratedColumn()
    id_log: number;

    @Column()
    message: string;

    @CreateDateColumn()
    created_date;

    @DeleteDateColumn()
    deleted_date;
}