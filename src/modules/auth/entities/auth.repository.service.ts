/*
https://docs.nestjs.com/providers#services
*/

import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Auth_Ety } from './auth.entity';

import { _Find_One_I, _Process_Save_I, _Process_Update_I } from '@tesis-project/dev-globals/dist/core/interfaces';

@Injectable()
export class AuthRepositoryService extends EntityRepository<Auth_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em, Auth_Ety);
    }

    async create_auth( {save, _em}: _Process_Save_I<Auth_Ety>): Promise<Auth_Ety> {

        const new_user = await _em.create(Auth_Ety, save);
        await _em.persistAndFlush(new_user);
        return new_user;

    }

    async find_one({ find, options, _em }: _Find_One_I<Auth_Ety, 'Auth_Ety'>): Promise<Auth_Ety> {

        return await _em.findOne(Auth_Ety, find, options);

    }

    async find_all(em?: EntityManager): Promise<Auth_Ety[]> {
        const _em = em ?? this.em;
        return await _em.find(Auth_Ety, {});
    }

    async delete_auth({ find, _em }: _Find_One_I<Auth_Ety, 'Auth_Ety'>): Promise<boolean> {

        const user_find = await this.find_one({ find, _em });

        if (!user_find) {
            throw new Error('User not found');
        }

        await _em.removeAndFlush(user_find);
        return true;
    }

    async update_auth({ find, update, _em }: _Process_Update_I): Promise<Auth_Ety> {


        const user_find = await this.find_one({find, _em});

        if (!user_find) {
            throw new Error('User not found');
        }

        Object.assign(user_find, update);
        await _em.persistAndFlush(user_find);
        return user_find;

    }





}
