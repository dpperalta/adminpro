import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: ['./incrementador.component.css']
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Input() leyenda: string = 'Leyenda'; //@Input('nombre') => en caso de requerirse enviar un argumento con nombre diferente, pero debe ser enviado desde el HTML con el nombre definido en el argumento
  @Input() progreso: number = 50;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter(); // Puesta en práctica línea 10

  constructor() {  }

  ngOnInit() {  }

  onChanges(newValue){

    //let elemHTML: any = document.getElementsByName('progreso')[0]; //Se utliza en caso de un único elemento a referenciar
    //console.log(elemHTML.value);

    if(newValue >= 100){
      this.progreso = 100;
    } else if( newValue <= 0){
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }
    //elemHTML.value = this.progreso; //Usado por línea 23
    this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
    
    this.txtProgress.nativeElement.focus();
  }

  cambiarValor (valor: number){

    if(this.progreso >= 100 && valor > 0){
      this.progreso = 100;
      return;
    }
    if(this.progreso <= 0 && valor < 0){
      this.progreso = 0;
      return;
    }

    this.progreso = this.progreso + valor;

    this.cambioValor.emit(this.progreso);
  }

}
