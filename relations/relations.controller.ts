import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LibroService } from './libro.service';
import { UsuarioService } from './usuario.service';
import { VentaService } from './venta.service';

@Controller('rel')
export class RelationsController {

     constructor(
    private readonly usuarioService: UsuarioService,
    private readonly libroService: LibroService,
    private readonly ventaService: VentaService,
  ) {}

  // Usuarios
  @Post('usuarios')
  createUsuario(@Body() createUsuarioDto: any) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get('usuarios')
  findAllUsuarios() {
    return this.usuarioService.findAll();
  }

  @Get('usuarios/:id')
  findOneUsuario(@Param('id') id: number) {
    return this.usuarioService.findOne(id);
  }

  @Put('usuarios/:id')
  updateUsuario(@Param('id') id: number, @Body() updateUsuarioDto: any) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete('usuarios/:id')
  removeUsuario(@Param('id') id: number) {
    return this.usuarioService.remove(id);
  }

  // Libros
  @Post('libros')
  createLibro(@Body() createLibroDto: any) {
    return this.libroService.create(createLibroDto);
  }

  @Get('libros')
  findAllLibros() {
    return this.libroService.findAll();
  }

  @Get('libros/:id')
  findOneLibro(@Param('id') id: number) {
    return this.libroService.findOne(id);
  }

  @Put('libros/:id')
  updateLibro(@Param('id') id: number, @Body() updateLibroDto: any) {
    return this.libroService.update(id, updateLibroDto);
  }

  @Delete('libros/:id')
  removeLibro(@Param('id') id: number) {
    return this.libroService.remove(id);
  }

  // Ventas
  @Post('ventas')
  createVenta(@Body() createVentaDto: any) {
    return this.ventaService.create(createVentaDto);
  }

  @Get('ventas')
  findAllVentas() {
    return this.ventaService.findAll();
  }

  @Get('ventas/:id')
  findOneVenta(@Param('id') id: number) {
    return this.ventaService.findOne(id);
  }

  @Put('ventas/:id')
  updateVenta(@Param('id') id: number, @Body() updateVentaDto: any) {
    return this.ventaService.update(id, updateVentaDto);
  }

  @Delete('ventas/:id')
  removeVenta(@Param('id') id: number) {
    return this.ventaService.remove(id);
  }

}
