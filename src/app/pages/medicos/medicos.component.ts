import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: any = 0;
  cargando: boolean = true;
  totalRegistros: any = 0;

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  /*cargarMedicos(){
    this.cargando = true;
    this._medicoService.cargarMedicos(this.desde)
            .subscribe( medicos => {
              this.medicos =  medicos;
              this.cargando = false;
            });
  } // Método orginal, pero no funcionaba el paginador, revisar

  cambiarDesde(valor: Number){
    let desde = this.desde + valor;
    let totalRegistros = this._medicoService.totalMedicos;
    if(desde > totalRegistros){
      return;
    }
    if(desde < 0){
      return;
    }
    this.desde += valor;
  }*/
  
  cargarMedicos(){
    this.cargando = true;
    this._medicoService.cargarMedicos(this.desde)
          .subscribe((resp: any) =>{
            console.log(resp);
            this.totalRegistros = resp.total;
            this.medicos = resp.medicos;
            this.cargando = false;
          })
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
    this.cargarMedicos();
  }

  buscarMedico(termino: string){
    if(termino.length <=0 ){
      this.cargarMedicos();
      return;
    }
    this.cargando = true;
    this._medicoService.buscarMedicos(termino)
          .subscribe( (medicos) => {
            this.medicos = medicos;
            this.cargando = false;
          });
  }
  borrarMedico(medico: Medico){
    this._medicoService.borrarMedico(medico._id)
          .subscribe((resp: any) => {
            this.totalRegistros--;
            this.cargarMedicos();
          });
  }
}
