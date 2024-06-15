/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Libro } from './entities/book.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { LibroRepository } from './entities/librorepository.service';
import { UsuarioRepository } from './entities/usuariorepository.service';
import { VentaRepository } from './entities/ventarepository.service';

@Injectable()
export class LibroService {

    constructor(
        // @InjectRepository(Libro)
        // private readonly libroRepository: LibroRepository,

            private readonly libroRepository: LibroRepository,
              private readonly usuarioRepository: UsuarioRepository,
                  private readonly ventaRepository: VentaRepository
    ) { }

    async create(libro: Partial<Libro>) {

        // const user = await this.usuarioRepository.findOne(libro.usuario);
        // libro.usuario = user;

        const venta = await this.ventaRepository.create_venta({
            usuario: libro.usuario,
        });

        return this.libroRepository.create_book({
            ...libro,
            venta,
            // usuario: user
        });
    }

    findAll() {
        return this.libroRepository.find_all();
    }

    findOne(id: number) {
        return this.libroRepository.findOne({ _id: id });
    }

    update(id: number, libro: Partial<Libro>) {
        return this.libroRepository.nativeUpdate({ _id: id }, libro);
    }

    remove(id: number) {
        return this.libroRepository.nativeDelete({ _id: id });
    }

}
