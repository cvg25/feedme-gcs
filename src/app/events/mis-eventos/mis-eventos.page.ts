import { Component, OnInit } from '@angular/core';
import { Evento } from '../evento.model'

import { usuarioserviceService } from '../../user/user-service.service'

import { EventosServiceService } from '../eventos-service.service'
import { User } from '../../user/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.page.html',
  styleUrls: ['./mis-eventos.page.scss'],
})
export class MisEventosPage implements OnInit {
  misEventos: Evento[] = []

  usersMap: any = {}

  usuarioLoggeado: User

  constructor(private eventoService: EventosServiceService,
    private userService: usuarioserviceService,
    private router: Router,
    private http: HttpClient) { }

  async ngOnInit() {

    //Cargamos las eventos de la bd
    this.usuarioLoggeado = await this.userService.getLoggedUser()

    this.usersMap = await this.userService.getAllUsuariosMap()
    this.misEventos = await this.eventoService.getUserIdCalendar(this.usuarioLoggeado.id)


   // if (this.misEventos.length == 0) {
      //cargamos desde el json
    //  await this.leerEventosJSON()
    //}

  }


  
  async ionViewWillEnter() {
      //Cargamos las eventos de la bd
      this.usuarioLoggeado = await this.userService.getLoggedUser()

      this.usersMap = await this.userService.getAllUsuariosMap()
      this.misEventos = await this.eventoService.getUserIdCalendar(this.usuarioLoggeado.id)
  }


  async addCalendar(userId, eventoId) {
    this.eventoService.addCalendar(userId, eventoId)
    //Obtenemos la evento de la UI
    var evento = this.misEventos.find(evento => {
      return evento.id === eventoId
    })
    //Comprobamos que existe la evento, y actualizamos metiendo el like del usuario.
    if (evento) {
      evento.usuarios.push(userId)
    }
  }

  removeCalendar(userId, eventoId) {
    this.eventoService.removeCalendar(userId, eventoId)
    //Obtenemos la evento de la UI 
    var evento = this.misEventos.find(evento => {
      return evento.id === eventoId
    })
    //Comprobamos que existe la evento, y actualizamos quitando el like del usuario.
    if (evento) {
      var likes = evento.usuarios.filter(user_id => {
        return user_id != userId
      })
      //Actualizamos los likes de la evento
      evento.usuarios = likes
    }
  }

  //Método para leer los eventos del json y guardarlos en la bbdd local
  leerEventosJSON() {
    this.http.get('assets/bbdd/eventos.json').pipe(map(async res => {
      for (var i = 0; i < 6; i++) {
        var evento = res[i]
        await this.eventoService.saveEvent(evento);
      }
      this.misEventos = await this.eventoService.getUserIdCalendar(this.usuarioLoggeado.id)

    })).subscribe()
  }

  visualizarUsuario(id: string) {
    if (this.usuarioLoggeado.id != id) {
      this.router.navigateByUrl('tabs/eventos/user-info/' + id)
    }
    else {
      this.router.navigateByUrl('tabs/perfil')
    }
  }

  visualizarEventos(id: string) {
    if (this.usuarioLoggeado.id != id) {
      this.router.navigateByUrl('tabs/login')
    }
    else {
      this.router.navigateByUrl('tabs/eventos')
    }
  }

  nuevoEvento(id: string) {
    if (this.usuarioLoggeado.id != id) {
      this.router.navigateByUrl('tabs/login')
    }
    else {
      this.router.navigateByUrl('tabs/eventos/crear-evento')
    }
  }

  visualizarEvento(id: string) {
    this.router.navigateByUrl('tabs/eventos/info/' + id +  '/eventos' )
  }

}
