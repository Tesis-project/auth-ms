/*
https://docs.nestjs.com/providers#services
*/

import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Usuario } from './user.entity';

@Injectable()
export class UsuarioRepository extends EntityRepository<Usuario> {

      constructor(em: EntityManager) {
        super(em, Usuario);
    }

    async create_user(usuario): Promise<Usuario> {
        const user = this.create(usuario);
        await this.em.persistAndFlush(user);
        return user;
    }



}
