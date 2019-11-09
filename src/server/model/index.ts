import {
    BaseEntity,
    Entity,
    Column,
    Index,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany
} from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ length: 40 })
    username: string;
}
