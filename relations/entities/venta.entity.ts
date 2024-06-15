import { Entity, PrimaryKey, ManyToOne, OneToOne, EntityRepository } from '@mikro-orm/core';
import { Usuario } from './user.entity';
import { Libro } from './book.entity';
import { Injectable } from '@nestjs/common';

@Entity()
export class Venta {

    @PrimaryKey()
    _id: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @OneToOne(() => Libro, libro => libro.venta)
    libro: Libro;

}

