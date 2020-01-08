import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/ususario.model';
import { element } from 'protractor';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;
  auth2: any;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if(this.email.length > 1){
      this.recuerdame = true;
    }
  }
  // Autenticación con Google Sign-In 
  googleInit(){
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        clien_id: '617860589515-1f1dn7802ehg59j0lb4qd0dlmb32470k.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }
  attachSignin(element){
    this.auth2.attachClickHandler(element, {}, (googleUser) => { // (googleUser es lo que se recibe de la función)
      //let profile = googleUser.getBasicProfile(); // Para obtener la información del perfil del Usuario
      //console.log(profile);
      let token = googleUser.getAuthResponse().id_token;
      //console.log(token);
      this._usuarioService.loginGoogle(token)
          .subscribe(()=> window.location.href = '#/dashboard'
          //.subscribe(()=> this.router.navigate(['/dashboard']) // No funcionaba el template por eso se usó vanillaJS
          //.subscribe( resp => {
            //console.log(resp);
          );
    });
  }

  // Fin de la autenticación con Google Sign-In
  ingresar(forma: NgForm){
    let usuario = new Usuario(null, forma.value.email, forma.value.password);
    if(forma.invalid){
      return;
    }
    
    this._usuarioService.login(usuario, forma.value.recuerdame)
            .subscribe( correcto => this.router.navigate(['/dashboard']) );
    //this.router.navigate(['/dashboard']);
    //console.log('Forma válida: ', forma.valid);
    //console.log(forma.value);
  }

}
