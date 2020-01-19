import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from 'src/app/models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  
  hospitales: Hospital[] = [];
  desde: any = 0;
  totalRegistros: any = 0 // Debería ser de tipo Number pero da error "operador + no se asigna a Number"
  cargando: boolean = true;


  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
          .subscribe(() => this.cargarHospitales());
  }

  cargarHospitales(){
    this.cargando = true;
    this._hospitalService.cargarHospitales(this.desde)
            .subscribe( (resp: any) =>{
              //console.log(resp);
              this.totalRegistros = resp.total;
              this.hospitales = resp.hospitales;
              this.cargando = false;
            });
  }

  cambiarDesde(valor: Number){
    let desde = this.desde + valor;
    if(desde >= this.totalRegistros){
      return;
    }
    if(desde < 0){
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }

 buscarHospital(termino: string){
   if(termino.length <= 0){
     this.cargarHospitales();
     return;
   }
   this.cargando = true;
   this._hospitalService.buscarHospitales(termino)
              .subscribe((hospitales: Hospital[]) => {
                this.hospitales = hospitales;
                this.cargando = false;
              });
 }

  guardarHospital(hospital: Hospital){
    this._hospitalService.actualizarHospital(hospital)
              .subscribe();
  }

  async crearHospital(){
   const inputValue = '';
   const { value: nombre } = await Swal.fire({
    title: 'Ingrese el nombre del Hospital',
    input: 'text',
    inputValue: inputValue,
    showCancelButton: true,
    inputValidator: (value) => {
      if(!value){
        return 'Es necesario ingresar el nombre'
      }
    }
   })
   if(nombre){
     console.log(nombre);
     this._hospitalService.crearHospital(nombre)
          .subscribe();   
   }
  }
 borrarHospital(hospital: Hospital){
   Swal.fire({
     title: '¿Está seguro?',
     text: 'Desea borrar ' + hospital.nombre,
     icon: 'warning',
     showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar'
   }).then( borrar => {
     if(borrar.value){
       this._hospitalService.borrarHospital(hospital._id)
              .subscribe( borrado => {
                this.totalRegistros--;
                if(this.desde >= this.totalRegistros){
                  this.desde = this.desde - 5;
                }
                this.cargarHospitales();
              });
     }
   });
 }
 /*
  actualizarImagen(hospital: Hospital){
  this._modalUploadService.mostrarModal('hospital', hospital._id);
 }
 */
  actualizarImagen(hospital: Hospital){
    this._modalUploadService.mostrarModal('hospitales', hospital._id);
  }

}
