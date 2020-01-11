import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/ususario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string;

  constructor(
    public _usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

  guardar(usuario: Usuario){
    this.usuario.nombre = usuario.nombre;
    if(!usuario.google){
      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario(this.usuario)
            .subscribe( 
             /* resp => {
              console.log(resp);
            }*/
            );
  }

  seleccionarImagen( archivo: File ){
    if(!archivo){
      this.imagenSubir = null;
      return;
    }
    if(archivo.type.indexOf('image') < 0){
      Swal.fire('Únicamente Imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;
    let reader = new FileReader();
    let urlArchivoTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  cambiarImagen(){
    this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}
