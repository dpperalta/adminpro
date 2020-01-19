import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital: Hospital;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
  ) { 

    console.log('Servicio de Hospitales Listo');
    //this.cargarStorage();
  }
  
  estaLogueado(){
     return (this.token.length >= 5) ? true : false;
   }

  
 cargarHospitales(desde: Number = 0){
   let url = URL_SERVICIOS + '/hospital?desde=' + desde;
   return this.http.get(url);
 }

 // Se duplica método para realizar carga de hospitales en otros componentes
 cargarHospitalesMedicos(desde: Number = 0){
  let url = URL_SERVICIOS + '/hospital?desde=' + desde;
  return this.http.get(url)
          .map((resp:any) => {
            return resp.hospitales;
          });
}

 buscarHospitales(termino: string){
   let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
   return this.http.get(url)
            .map( (resp: any) => resp.hospitales );
 }
 
  actualizarHospital(hospital: Hospital){
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    //url += '?token=' + this.token;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, hospital)
            .map((resp: any) => {
              Swal.fire('Hospital Actualizado', hospital.nombre, 'success');
              return true;
            });
  }
  
  crearHospital(nombre: string){
    console.log('nombreSer: ', nombre);
    let url = URL_SERVICIOS + '/hospital';
    //url += '?token=' + this.token;
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre: nombre})
          .pipe().map(resp => {
            console.log(resp);
            Swal.fire('Hospital Creado Satisfactoriamente', nombre, 'success');
          });
  } 

 borrarHospital(id: string){
     let url = URL_SERVICIOS + '/hospital/' + id;
   //url += '?token=' + this.token; // Mi forma, cargando del localStorage el Token es menos segura
   url += '?token=' + this._usuarioService.token;
   return this.http.delete(url)
          .map(resp => {
            Swal.fire('Hospital Eliminado', 'El hospital ha sido eliminado correctamente', 'success' );
            return true;
          })
 }

 obtenerHospital(id: string){
   let url = URL_SERVICIOS + '/hospital/' + id;
   return this.http.get(url)
            .map((resp: any) => resp.hospital);
 }

}