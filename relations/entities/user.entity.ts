import { Entity, PrimaryKey, Property, OneToMany, Collection, EntityRepository, EntityManager } from '@mikro-orm/core';
import { Libro } from './book.entity';
import { Venta } from './venta.entity';
import { Injectable } from '@nestjs/common';

@Entity()
export class Usuario {

    @PrimaryKey()
    _id: number;

    @Property()
    nombre: string;

    @OneToMany(() => Libro, libro => libro.usuario)
    libros: Libro[];

    @OneToMany(() => Venta, venta => venta.usuario)
    ventas: Venta[];
}

