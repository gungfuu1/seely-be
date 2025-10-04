import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKeycloakColumnsToUsers1738499999999 implements MigrationInterface {
    name = 'AddKeycloakColumnsToUsers1738499999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
       // ปรับปรุง table users
       await queryRunner.query(`
            ALTER TABLE "users"
            ADD "keycloak_id" character varying(255);
        `);
       
        
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "password" DROP NOT NULL
        `);

        
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email" character varying(255) UNIQUE
        `);

        
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying(100)
        `);

        
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying(100)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "last_name"
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "first_name"
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "email"
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "password" SET NOT NULL
        `);
    }
}
