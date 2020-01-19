import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from '../../services/service.index';
import { HospitalService } from '../../services/service.index';
import { Medico } from 'src/app/models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', ''); //Se inicializa para que se pueda mostrar la información vacía en el formulario
  hospital: Hospital = new Hospital('');

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService
  ) { 
    activatedRoute.params.subscribe( params => {
      let id = params['id'];
      if(id !== 'nuevo'){
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit() {
    this._hospitalService.cargarHospitalesMedicos()
          .subscribe(hospitales => this.hospitales = hospitales);
    this._modalUploadService.notificacion
          .subscribe(resp => {
            //console.log(resp);
            this.medico.img = resp.medico.img;
          });
  }

  cargarMedico(id: string){
    this._medicoService.cargarMedico(id)
          .subscribe(medico => {
            this.medico = medico;
            this.medico.hospital = medico.hospital._id;
            this.cambiarHospital(this.medico.hospital);
          });
  }

  guardarMedico(f: NgForm){
    console.log(f.valid);
    console.log(f.value);
    if(f.invalid){
      return;
    }
    this._medicoService.guardarMedico(this.medico)
            .subscribe( medico => {
              //console.log(medico);
              this.medico._id = medico._id;
              this.router.navigate(['/medico', medico._id]);
            });
  }

  cambiarHospital ( id){
    this._hospitalService.obtenerHospital(id)
            .subscribe( hospital => {
                //console.log(hospital); //se puede resumir a (hospital => this.hospital = hospital); pero se necesita implementar más lógica
              this.hospital = hospital;
            });
  }

  cambiarFoto(){
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
