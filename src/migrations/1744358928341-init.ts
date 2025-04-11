import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744358928341 implements MigrationInterface {
    name = 'Init1744358928341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime(3), "deleted" boolean NOT NULL DEFAULT (0), "deleted_at" datetime(3), "email" varchar NOT NULL, "username" varchar, "password" varchar NOT NULL, "created_by" integer, "updated_by" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime(3), "deleted" boolean NOT NULL DEFAULT (0), "deleted_at" datetime(3), "email" varchar NOT NULL, "username" varchar, "password" varchar NOT NULL, "created_by" integer, "updated_by" integer, CONSTRAINT "FK_f32b1cb14a9920477bcfd63df2c" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b75c92ef36f432fe68ec300a7d4" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "created_at", "updated_at", "deleted", "deleted_at", "email", "username", "password", "created_by", "updated_by") SELECT "id", "created_at", "updated_at", "deleted", "deleted_at", "email", "username", "password", "created_by", "updated_by" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "created_at" datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime(3), "deleted" boolean NOT NULL DEFAULT (0), "deleted_at" datetime(3), "email" varchar NOT NULL, "username" varchar, "password" varchar NOT NULL, "created_by" integer, "updated_by" integer)`);
        await queryRunner.query(`INSERT INTO "users"("id", "created_at", "updated_at", "deleted", "deleted_at", "email", "username", "password", "created_by", "updated_by") SELECT "id", "created_at", "updated_at", "deleted", "deleted_at", "email", "username", "password", "created_by", "updated_by" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
