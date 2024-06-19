import { Migration } from '@mikro-orm/migrations';

export class Migration20240617031717_userUnique_irel extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "auth" alter column "created_at" set default \'2024-06-16 23:17:17\';');
    this.addSql('alter table "auth" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "auth" alter column "updated_at" set default \'2024-06-16 23:17:17\';');
    this.addSql('alter table "auth" add constraint "auth_user_unique" unique ("user");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth" drop constraint "auth_user_unique";');

    this.addSql('alter table "auth" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "auth" alter column "created_at" set default \'2024-06-16 20:04:37\';');
    this.addSql('alter table "auth" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "auth" alter column "updated_at" set default \'2024-06-16 20:04:37\';');
  }

}
