import { Migration } from '@mikro-orm/migrations';

export class Migration20240617000437_set_auth_v1 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth" ("_id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, "password" varchar(255) not null, "username" varchar(255) null, "created_at" timestamptz not null default \'2024-06-16 20:04:37\', "updated_at" timestamptz not null default \'2024-06-16 20:04:37\', "last_session" timestamptz null, "status" text check ("status" in (\'NONE\', \'VERIFIED\', \'NOT\', \'BLOCKED\', \'DELETED\', \'SUSPENDED\', \'PENDING\', \'ACTIVE\', \'INACTIVE\')) not null default \'PENDING\', "user" varchar(255) not null, constraint "auth_pkey" primary key ("_id"));');
    this.addSql('alter table "auth" add constraint "auth_email_unique" unique ("email");');
    this.addSql('alter table "auth" add constraint "auth_username_unique" unique ("username");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "auth" cascade;');
  }

}
