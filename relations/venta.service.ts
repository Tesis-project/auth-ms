/*
https://docs.nestjs.com/providers#services
*/

import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Venta } from './entities/venta.entity';
import { VentaRepository } from './entities/ventarepository.service';

@Injectable()
export class VentaService {

    constructor(
        // @InjectRepository(Venta)
        // private readonly ventaRepository: VentaRepository,

            private readonly ventaRepository: VentaRepository
    ) { }

    create(venta: Partial<Venta>) {
        return this.ventaRepository.create(venta);
    }

    findAll() {
        return this.ventaRepository.findAll();
    }

    findOne(id: number) {
        return this.ventaRepository.findOne({ _id: id });
    }

    update(id: number, venta: Partial<Venta>) {
        return this.ventaRepository.nativeUpdate({ _id: id }, venta);
    }

    remove(id: number) {
        return this.ventaRepository.nativeDelete({ _id: id });
    }

}
