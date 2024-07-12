import { Migration } from '@mikro-orm/migrations';

export class Migration20240708125620_set_roles extends Migration {

  async up(): Promise<void> {


    this.addSql('alter table "auth" add column "role" text check ("role" in (\'ARTIST_ROLE\', \'CONTRATIST_ROLE\', \'ADMIN_ROLE\')) not null default \'ARTIST_ROLE\';');
    this.addSql('alter table "auth" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "auth" alter column "created_at" set default \'2024-07-08 08:56:20\';');
    this.addSql('alter table "auth" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "auth" alter column "updated_at" set default \'2024-07-08 08:56:20\';');
  }

  async down(): Promise<void> {

    this.addSql('alter table "auth" drop column "role";');

    this.addSql('alter table "auth" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));');
    this.addSql('alter table "auth" alter column "created_at" set default \'2024-06-16 20:04:37+00\';');
    this.addSql('alter table "auth" alter column "updated_at" type timestamptz(6) using ("updated_at"::timestamptz(6));');
    this.addSql('alter table "auth" alter column "updated_at" set default \'2024-06-16 20:04:37+00\';');
  }

}
