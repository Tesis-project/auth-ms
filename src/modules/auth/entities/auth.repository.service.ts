/*
https://docs.nestjs.com/providers#services
*/

import { EntityManager, EntityName, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Auth_Ety } from './auth.entity';

@Injectable()
export class AuthRepositoryService extends EntityRepository<Auth_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em, Auth_Ety);
    }

    async create_user(user: Partial<Auth_Ety>, em?: EntityManager): Promise<Auth_Ety> {

        const _em = em ?? this.em;
        const new_user = await _em.create(Auth_Ety, user);
        await _em.persistAndFlush(new_user);
        return new_user;

    }

    async find_one(user: Partial<Auth_Ety>, em?: EntityManager): Promise<Auth_Ety> {

        const _em = em ?? this.em;
        return await _em.findOne(Auth_Ety, user);

    }

    async find_all(em?: EntityManager): Promise<Auth_Ety[]> {
        const _em = em ?? this.em;
        return await _em.find(Auth_Ety, {});
    }

    async delete_user(user: Partial<Auth_Ety>, em?: EntityManager): Promise<boolean> {
        const _em = em ?? this.em;
        // const user = await _em.findOne(Auth_Ety, { id });
        const user_find = await this.find_one(user, _em);

        if (!user_find) {
            throw new Error('User not found');
        }

        await _em.removeAndFlush(user_find);
        return true;
    }

    async update_user(user: Partial<Auth_Ety>, updateData: Partial<Auth_Ety>, em?: EntityManager): Promise<Auth_Ety> {

        const _em = em ?? this.em;

        const user_find = await this.find_one(user, _em);

        if (!user_find) {
            throw new Error('User not found');
        }

        Object.assign(user_find, updateData);
        await _em.persistAndFlush(user_find);
        return user_find;

    }





}
