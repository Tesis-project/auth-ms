import { Module } from '@nestjs/common';
import { RelationsController } from './relations.controller';
import { Usuario } from './entities/user.entity';
import { Libro } from './entities/book.entity';
import { Venta } from './entities/venta.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsuarioService } from './usuario.service';
import { VentaService } from './venta.service';
import { LibroService } from './libro.service';
import { VentaRepository } from './entities/ventarepository.service';
import { LibroRepository } from './entities/librorepository.service';
import { UsuarioRepository } from './entities/usuariorepository.service';

@Module({
    controllers: [RelationsController],
    providers: [
            VentaRepository,
            LibroRepository,
            UsuarioRepository,

            UsuarioService,
            VentaService,
            LibroService
        ],
    imports: [
        MikroOrmModule.forFeature([
            Usuario,
            Libro,
            Venta
        ])

    ]
})
export class RelationsModule {  }
