import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [];
  /*menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        {titulo: 'Dashboard', url: '/dashboard'},
        {titulo: 'Progress Bar', url: '/progress'},
        {titulo: 'Gráficas', url: '/graficas1'},
        {titulo: 'Promesas', url: '/promesas'},
        {titulo: 'RxJs', url: '/rxjs'}
      ]
    },
    {
      titulo: 'Mantenimiento',
      //icono: 'mdi mdi-folder-lock-open',
      icono: 'mdi mdi-account-star',  // Los íconos se encuentran en la siguiente dirección: https://cdn.materialdesignicons.com/1.1.34/
      submenu: [
        {titulo: 'Usuarios', url: '/usuarios'},
        {titulo: 'Hospitales', url: '/hospitales'},
        {titulo: 'Médicos', url: '/medicos'}
      ]
    }
  ];*/

  constructor(
    public _usuarioService: UsuarioService
  ) { }

   cargarMenu(){
    this.menu = this._usuarioService.menu;
   }
}
