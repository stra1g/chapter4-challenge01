import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterStatementAddSenderId1644363745090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("statements", new TableColumn({
        name: "sender_id",
        type: "uuid",
        isNullable: true
      }));

      await queryRunner.createForeignKey("statements", new TableForeignKey({
        name: "FKSenderStatement",
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        columnNames: ["sender_id"],
        onDelete: "SET NULL",
        onUpdate: "SET NULL"
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey("statements", "FKSenderStatement");
      await queryRunner.dropColumn("statements", "sender_id");
    }

}
