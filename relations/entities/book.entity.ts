import { Entity, PrimaryKey, Property, ManyToOne, OneToOne } from '@mikro-orm/core';
import { Usuario } from './user.entity';
import { Venta } from './venta.entity';


@Entity()
export class Libro {
    
  @PrimaryKey()
  _id: number;

  @Property()
  titulo: string;

  @ManyToOne(() => Usuario)
  usuario: Usuario;

 @OneToOne(() => Venta,  { owner: true })
  venta: Venta;

}
