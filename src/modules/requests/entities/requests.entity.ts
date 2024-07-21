

import { Entity, Property, Enum, EntityRepositoryType, ManyToOne, Rel, Cascade } from "@mikro-orm/core";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { RequestType_Enum, RequestStatus_Enum } from "@tesis-project/dev-globals/dist/modules/auth/interfaces/requests";
import { Schema_key } from "../../../core/entities_global";
import { Requests_Repository } from "./requests.repository.service";
import { Auth_Ety } from '../../auth/entities/auth.entity';


@Entity({
    tableName: 'auth_requests',
    collection: 'auth_requests',
    repository: () => Requests_Repository
})
export class Requests_Ety extends Schema_key {

    [EntityRepositoryType]?: Requests_Repository;

    @Property({
        type: 'varchar'
    })
    key: string;

    @Enum({ items: () => RequestType_Enum })
    @Property()
    type: RequestType_Enum;

    @Enum({ items: () => RequestStatus_Enum })
    @Property({
        default: RequestStatus_Enum.PENDING
    })
    status: RequestStatus_Enum = RequestStatus_Enum.PENDING;

    @Property({
        type: 'varchar',
        nullable: true
    })
    detail?: string;

    @Property({
        type: 'timestamp',
        onCreate: () => new TempoHandler().date_now()
    })
    created_at? = new TempoHandler().date_now()

    @Property({
        type: 'timestamp',
        nullable: true,
        // onUpdate: () => new TempoHandler().date_now()
    })
    used_at?: string;

    @ManyToOne(() => Auth_Ety, { cascade: [Cascade.ALL] })
    auth: Rel<Auth_Ety>;

}

