import * as Orm from "typeorm";

// NOTE: some combinations of flags won't make sense... but maybe that's ok.
export enum PermissionFlag {
    publicRead = 1 << 0,
    publicInsert = 1 << 1,
    wnerInsert = 1 << 2,
    ownerUpdate = 1 << 3,
    ownerDelete = 1 << 4,
    groupRead = 1 << 5,
    groupInsert = 1 << 6,
    groupUpdate = 1 << 7,
    groupDelete = 1 << 8,
    modRead = 1 << 9,
    modInsert = 1 << 10,
    modUpdate = 1 << 11,
    modDelete = 1 << 12
}

export class Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ type: "int" })
    permissionPolicy: number; // permissionPolicy: bitmask of PermissionFlags

    //@Orm.ManyToMany(() => 
}
