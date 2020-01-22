import { Injectable } from '@angular/core';
import { Usuario } from '../../models/ususario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

//import { map } from 'rxjs/operators';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
    ) //Importartar el HttpClienteModule en service.module 
  {
    //console.log('Servicio de Usuario Listo');
    this.cargarStorage();
   }

   renuevaToken(){
     let url = URL_SERVICIOS + '/login/renuevatoken';
     url += '?token=' + this.token;
     return this.http.get(url)
            .map((resp: any) => {
              this.token = resp.token;
              localStorage.setItem('token', this.token);
              console.log('Token Renovado');
              return true;
            })
            .catch( err => {
              this.router.navigate(['/login']);
              Swal.fire('¡Hubo un problema con la Autenticación', 'No se pudo renovar Token', 'error');
              return Observable.throw(err);
            });
   }

   estaLogueado(){
     return (this.token.length >= 5) ? true : false;
   }

   cargarStorage(){
     if(localStorage.getItem('token')){
       this.token = localStorage.getItem('token');
       this.usuario = JSON.parse(localStorage.getItem('usuario'));
       this.menu = JSON.parse(localStorage.getItem('menu'));
     }
     else{
       this.token = '';
       this.usuario = null;
       this.menu = [];
     }
   }

   guardarStorage(id: string, token: string, usuario: Usuario, menu: any){
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('menu', JSON.stringify(menu));

      this.usuario = usuario;
      this.token = token;
      this.menu = menu;
   }

   logout(){
     this.usuario = null;
     this.token = '';
     this.menu = [];

     localStorage.removeItem('token');
     localStorage.removeItem('usuario');
     localStorage.removeItem('id'); //Opcional eliminar el ID del usuario
     localStorage.removeItem('menu');

     this.router.navigate(['/login']);
   }

   loginGoogle(token: string){
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, {token})
          .map((resp: any) => {
            this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
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
              this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                // localStorage.setItem('id', resp.id);
                // localStorage.setItem('token', resp.token);
                // localStorage.setItem('usuario', JSON.stringify(resp.usuario));
                return true;
            })
            .catch( err => {
              Swal.fire('Error en el Login', err.error.mensaje, 'error');
              return Observable.throw(err);
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
          })
          .catch( err => {
            Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
            return Observable.throw(err);
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
                this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
              }
              Swal.fire('Usuario Actualizado', usuario.nombre, 'success');
              return true;
            })
            .catch( err => {
              Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
              return Observable.throw(err);
            });

   }

   cambiarImagen( archivo: File, id: string){
      this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
              .then((resp: any ) => {
                //console.log(resp);
                this.usuario.img = resp.usuario.img;
                Swal.fire('Imagen Actualizada', this.usuario.nombre, 'success');
                this.guardarStorage(id, this.token, this.usuario, this.menu);
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
