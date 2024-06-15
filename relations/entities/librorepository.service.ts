/*
https://docs.nestjs.com/providers#services
*/

import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Libro } from './book.entity';


@Injectable()
export class LibroRepository extends EntityRepository<Libro> {

    constructor(em: EntityManager) {
        super(em, Libro);
    }

    async create_book(libro): Promise<Libro> {

        const book = this.create(libro);
        await this.em.persistAndFlush(book);
        return book;
    }

    async find_all(): Promise<Libro[]> {

        return this.findAll({
            
            populate: [
                'venta',
                'venta.usuario',
                'venta.libro',
                'usuario'
            ],
        });



    }




}

