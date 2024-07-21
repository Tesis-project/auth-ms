import { EntityRepository, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";
import { _Process_Save_I, _Find_Many_I, _Process_Delete_I, _Process_Update_I } from "@tesis-project/dev-globals/dist/core/interfaces";
import { Requests_Ety } from "./requests.entity";
import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';


@Injectable()
export class Requests_Repository extends EntityRepository<Requests_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), Requests_Ety);
    }


    async create_requests({ save, _em }: _Process_Save_I<Requests_Ety>): Promise<Requests_Ety> {

        const new_requests = await _em.create(Requests_Ety, save);
        await _em.persist(new_requests);
        return new_requests;

    }

    async find_all({ find, options, _em }: _Find_Many_I<Requests_Ety, 'Requests_Ety'>, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<Requests_Ety>> {

        if (!Pagination_Dto) {
            return {
                data: await this.find( find, options ),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Requests_Ety, find);

        const data = await _em.find(Requests_Ety, find, {
            ...options,
            limit,
            offset: (page - 1) * limit,
        });

        const meta: Pagination_I['meta'] = pagination_meta(page, limit, totalRecords);

        return {
            data,
            meta
        }

    }

    async delete_requests({ find, _em }: _Process_Delete_I<Requests_Ety>): Promise<boolean> {

        const request = await this.findOne( find );

        if (!request) {
            throw new Error('Notification not found');
        }

        await _em.nativeDelete(Requests_Ety, {
            _id: request._id
        });

        return true;

    }

    async update_requests({ find, update, _em }: _Process_Update_I<Requests_Ety>): Promise<Requests_Ety> {

        const request = await this.findOne( find );

        if (!request) {
            throw new Error('Notification not found');
        }

        Object.assign(request, update);
        await _em.persist(request);
        return request;

    }


}