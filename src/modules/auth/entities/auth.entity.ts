import { Entity, Enum, Property } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { TempoHandler } from '../../../core/classes/TempoHandler';
import { AuthStatus_Enum } from "../interfaces/auth.interface";

@Entity({
    tableName: 'auth',
    collection: 'auth'
})
export class Auth_Ety extends Schema_key {

    @Property({
        type: 'varchar',
        unique: true
    })
    email: string;

    @Property({
        type: 'varchar'
    })
    password: string;

    @Property({
        type: 'varchar',
        unique: true,
        nullable: true
    })
    username?: string;

    @Property({
        type: 'timestamp',
        onCreate: () => new TempoHandler().date_now()
    })
    created_at = new TempoHandler().date_now()

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at = new TempoHandler().date_now()

    @Property({
        type: 'timestamp',
        nullable: true
    })
    last_session: string;

    @Enum({ items: () => AuthStatus_Enum, default: AuthStatus_Enum.PENDING })
    @Property()
    status: AuthStatus_Enum;

    @Property({
        type: 'varchar',
        unique: true
    })
    user: any;

}
