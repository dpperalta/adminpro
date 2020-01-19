import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/ususario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  //desde: Number = 0; // Tipo Number era el original, pero dio error que no se puede asignar el operador + al Number (REVISAR)
  desde: any = 0;
  //totalRegistros: Number = 0;
  totalRegistros: any = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
          .subscribe(resp => this.cargarUsuarios());
  }

  mostrarModal(id: string){
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
            .subscribe( (resp: any) => {
              console.log(resp);
              this.totalRegistros = resp.total;
              this.usuarios = resp.usuarios;
              this.cargando = false;
            });

  }

  cambiarDesde(valor: Number){
    let desde = this.desde + valor;
    console.log(desde);

    if(desde >= this.totalRegistros){
      return;
    }
    if(desde < 0){
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string){
    if(termino.length <= 0){
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this._usuarioService.buscarUsuarios(termino)
              .subscribe((usuarios: Usuario[]) => {
                //console.log(usuarios);
                this.usuarios = usuarios;
                this.cargando = false;
              });
  }

  borrarUsuario( usuario: Usuario ){
    if (usuario._id === this._usuarioService.usuario._id){
      Swal.fire('No se puede borrar usuario', 'No se puede borrar a sí mismo', 'error');
      return;
    }
    Swal.fire({
      title: '¿Está seguro?',
      text: "Desea borrar a " + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar'
    }).then( borrar => {
      if (borrar.value) {
        this._usuarioService.borrarUsuario(usuario._id)
                .subscribe( borrado => {
                  //console.log(borrado);
                  //console.log(this.desde);
                  //console.log(this.totalRegistros);
                  this.totalRegistros--;
                  if(this.desde >= this.totalRegistros){
                    this.desde = this.desde - 5 ;
                    console.log('Entra al if', this.desde);
                  } //Intenté regesar al anterior índice cuando llegaba al límite
                  //this.desde = 0; // Se envía a la página inicial
                  this.cargarUsuarios();
                });
        
        /*Swal.fire(
          'Usuario Eliminado',
          'El usuario ha sido eliminado satisfactoriamente.',
          'success'
        )*/
      }
      console.log(borrar);
    })

    console.log(usuario);
  }
  guardarUsuario(usuario: Usuario){
    this._usuarioService.actualizarUsuario(usuario)
            .subscribe();
  }

}
