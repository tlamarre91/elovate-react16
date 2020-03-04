import * as Orm from "typeorm";

// NOTE: some combinations of flags won't make sense... but maybe that's ok.
export enum PermissionFlag {
    ownerInsert = 1 << 0,
    ownerUpdate = 1 << 1,
    ownerDelete = 1 << 2,
    groupRead = 1 << 3,
    groupInsert = 1 << 4,
    groupUpdate = 1 << 5,
    groupDelete = 1 << 6,
    modRead = 1 << 7,
    modInsert = 1 << 8,
    modUpdate = 1 << 9,
    modDelete = 1 << 10
}

export class Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ type: "int" })
    permissionPolicy: number; // permissionPolicy: bitmask of PermissionFlags
}
