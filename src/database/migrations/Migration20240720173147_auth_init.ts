import { Migration } from '@mikro-orm/migrations';

export class Migration20240720173147_auth_init extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth" ("_id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, "password" varchar(255) not null, "username" varchar(255) null, "created_at" timestamptz not null default \'2024-07-20 13:31:47\', "updated_at" timestamptz not null default \'2024-07-20 13:31:47\', "last_session" timestamptz null, "status" text check ("status" in (\'NONE\', \'VERIFIED\', \'NOT\', \'BLOCKED\', \'DELETED\', \'SUSPENDED\', \'PENDING\', \'ACTIVE\', \'INACTIVE\')) not null default \'PENDING\', "role" text check ("role" in (\'ARTIST_ROLE\', \'CONTRATIST_ROLE\', \'ADMIN_ROLE\')) not null default \'ARTIST_ROLE\', "user" varchar(255) not null, constraint "auth_pkey" primary key ("_id"));');
    this.addSql('alter table "auth" add constraint "auth_email_unique" unique ("email");');
    this.addSql('alter table "auth" add constraint "auth_username_unique" unique ("username");');
    this.addSql('alter table "auth" add constraint "auth_user_unique" unique ("user");');

    this.addSql('create table "auth_requests" ("_id" uuid not null default gen_random_uuid(), "key" varchar(255) not null, "type" text check ("type" in (\'CONFIRM_ACCOUNT\', \'RESET_PASSWORD\', \'CHANGE_EMAIL\')) not null, "status" text check ("status" in (\'PENDING\', \'USED\', \'EXPIRED\')) not null default \'PENDING\', "detail" varchar(255) null, "created_at" timestamptz not null default \'2024-07-20 13:31:47\', "used_at" timestamptz null, "auth__id" uuid null, constraint "auth_requests_pkey" primary key ("_id"));');

    this.addSql('alter table "auth_requests" add constraint "auth_requests_auth__id_foreign" foreign key ("auth__id") references "auth" ("_id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_requests" drop constraint "auth_requests_auth__id_foreign";');

    this.addSql('drop table if exists "auth" cascade;');

    this.addSql('drop table if exists "auth_requests" cascade;');
  }

}
