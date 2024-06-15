import { Migration } from '@mikro-orm/migrations';

export class Migration20240614233716_setAuth extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth" ("_id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "username" varchar(255) null, "created_at" timestamptz not null default \'2024-06-14 19:37:15\', "updated_at" timestamptz not null default \'2024-06-14 19:37:15\', "last_session" timestamptz null, constraint "auth_pkey" primary key ("_id"));');
    this.addSql('alter table "auth" add constraint "auth_email_unique" unique ("email");');
    this.addSql('alter table "auth" add constraint "auth_username_unique" unique ("username");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "auth" cascade;');
  }

}
