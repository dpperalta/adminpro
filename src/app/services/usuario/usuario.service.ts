import { Injectable } from '@angular/core';
import { Usuario } from '../../models/ususario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

//import { map } from 'rxjs/operators';

import 'rxjs/add/operator/map';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
    ) //Importartar el HttpClienteModule en service.module 
  {
    //console.log('Servicio de Usuario Listo');
    this.cargarStorage();
   }

   estaLogueado(){
     return (this.token.length >= 5) ? true : false;
   }

   cargarStorage(){
     if(localStorage.getItem('token')){
       this.token = localStorage.getItem('token');
       this.usuario = JSON.parse(localStorage.getItem('usuario'));
     }
     else{
       this.token = '';
       this.usuario = null;
     }
   }

   guardarStorage(id: string, token: string, usuario: Usuario){
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      this.usuario = usuario;
      this.token = token;
   }

   logout(){
     this.usuario = null;
     this.token = '';

     localStorage.removeItem('token');
     localStorage.removeItem('usuario');
     localStorage.removeItem('id'); //Opcional eliminar el ID del usuario

     this.router.navigate(['/login']);
   }

   loginGoogle(token: string){
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, {token})
          .map((resp: any) => {
            this.guardarStorage(resp.id, resp.token, resp.usuario);
            return true;
          });
   }

   login( usuario: Usuario, recordar: boolean = false){

    if(recordar){
      localStorage.setItem('email', usuario.email);
    }else{
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
            .map( (resp: any) => {
              this.guardarStorage(resp.id, resp.token, resp.usuario);
                // localStorage.setItem('id', resp.id);
                // localStorage.setItem('token', resp.token);
                // localStorage.setItem('usuario', JSON.stringify(resp.usuario));
                return true;
            });
   }

   crearUsuario(usuario: Usuario){
     let url = URL_SERVICIOS + '/usuario';

     return this.http.post(url, usuario)
          /*.pipe(map((resp: any) => {
            swal('Usuario creado', usuario.email, 'success');
            return usuario;
          }));*/
          // Para utilizar map, es necesario instalar npm install --save rxjs-compat
          .map((resp: any) => {

            Swal.fire('Usuario creado', usuario.email, 'success');
            return usuario
          });
   }

   actualizarUsuario(usuario: Usuario){

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    //console.log(url);

    return this.http.put(url, usuario)
            .map( (resp: any) => {
              //this.usuario = resp.usuario;
              if(usuario._id === this.usuario._id){
                let usuarioDB = resp.usuario;
                this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
              }
              
              Swal.fire('Usuario Actualizado', usuario.nombre, 'success');
              return true;
            });

   }

   cambiarImagen( archivo: File, id: string){
      this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
              .then((resp: any ) => {
                //console.log(resp);
                this.usuario.img = resp.usuario.img;
                Swal.fire('Imagen Actualizada', this.usuario.nombre, 'success');
                this.guardarStorage(id, this.token, this.usuario);
              })
              .catch(resp => {
                console.log(resp);
              });
   }

   cargarUsuarios(desde: Number = 0){
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
   }

   buscarUsuarios(termino: string){
     let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
     return this.http.get(url)
            .map( (resp: any) => resp.usuarios );
   }

   borrarUsuario(id: string){
     let url = URL_SERVICIOS + '/usuario/' + id;
     url += '?token=' + this.token;
     return this.http.delete(url)
            .map( resp => {
              Swal.fire('Usuario Borrado', 'El usuario ha sido eliminado correctamente', 'success');
              return true;
            });
   }

}
