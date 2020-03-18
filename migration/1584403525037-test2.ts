import {MigrationInterface, QueryRunner} from "typeorm";

export class test21584403525037 implements MigrationInterface {
    name = 'test21584403525037'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "dateCreated" SET DEFAULT 'NOW()'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "dateCreated" SET DEFAULT '2020-03-16'`, undefined);
    }

}
