/*
https://docs.nestjs.com/providers#services
*/

import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Venta } from './venta.entity';

@Injectable()
export class VentaRepository extends EntityRepository<Venta> {


    constructor(em: EntityManager) {
        super(em, Venta);
    }

    async create_venta(Venta): Promise<Venta> {
        const venta = this.create(Venta);
        await this.em.persistAndFlush(venta);
        return venta;
    }


}
