import { MigrationInterface, QueryRunner } from "typeorm";

export class GlobalUserSettings1744375377723 implements MigrationInterface {
    name = 'GlobalUserSettings1744375377723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "global_user_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "code" varchar NOT NULL, "label" varchar NOT NULL, "description" varchar, "default_value" varchar NOT NULL, CONSTRAINT "UQ_62a099df358f9f407259027c67c" UNIQUE ("code"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "global_user_settings"`);
    }

}
