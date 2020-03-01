import {
    getRepository,
    Repository,
    EntityRepository,
    Entity,
    BaseEntity,
    Column,
    Index,
    JoinTable,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany
} from "typeorm";

@Entity()
export class GroupUser {
    @PrimaryGeneratedColumn()
    id: number;
}
