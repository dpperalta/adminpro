import { Component, OnInit } from '@angular/core';
import { resolve } from 'url';
import { reject } from 'q';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    
    this.contarTres().then(
      //() => console.log('¡Terminó!') // Si no se envía mensaje, se inicia sin nombre de función
      mensaje => console.log('¡Terminó!', mensaje)
    )
    .catch(
      error => console.error('Error en la promesa: ', error)
    );
   }

  ngOnInit() {
  }

  contarTres(): Promise<boolean> {

    //let promesa = new Promise((resolve, reject) => {
      return new Promise ((resolve, reject) => {
      let contador = 0;
      //let minuto = 0;
      //let hora = 0
      let intervalo = setInterval(() => {
        contador += 1;
        //console.log('' + minuto + ': ' + contador);
        console.log(contador);
        if(contador === 3){
          resolve (true);
          //resolve('¡OK!') // Se puede terminar la promesa con un mensaje de finalización y mostrarlo en consola o agregarlo al log
          //resolve(); // Para finalizar correctamente la promesa
          //reject('Se terminó el tiempo de espera'); // Para finalizar la promesa con error
          clearInterval(intervalo);
          /*if(contador === 59){
            minuto += 1;
          }*/ // Agregar minutos
          contador = 0;
        }
      }, 1000);
    });

    //return promesa;

  }

}
