

import { Injectable } from '@nestjs/common';
import { Usuario } from './entities/user.entity';
import { UsuarioRepository } from './entities/usuariorepository.service';

@Injectable()
export class UsuarioService {

    constructor(
        // @InjectRepository(Usuario)
        // private readonly usuarioRepository: UsuarioRepository,
        private readonly usuarioRepository: UsuarioRepository
    ) { }

    create(usuario: Partial<Usuario>) {
        return this.usuarioRepository.create_user(usuario);
    }

    findAll() {

        return this.usuarioRepository.findAll({
            populate: [
                'libros',
                'libros.venta',
                // 'ventas'
            ]
        });

    }

    findOne(id: number) {
        return this.usuarioRepository.findOne({ _id: id });
    }

    update(id: number, usuario: Partial<Usuario>) {
        return this.usuarioRepository.nativeUpdate({ _id: id }, usuario);
    }

    remove(id: number) {
        return this.usuarioRepository.nativeDelete({ _id: id });
    }


}
