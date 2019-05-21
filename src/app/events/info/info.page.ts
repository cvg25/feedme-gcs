import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventosServiceService } from '../eventos-service.service'
import { User } from 'src/app/user/user.model';
import { usuarioserviceService } from 'src/app/user/user-service.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Evento } from '../evento.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage  {

  navegacion: string

  usuario: User
  eventId: string
  usuarioLoggeado: User
  evento: Evento
  eventos: Evento[] = []
  descripcionActivo: boolean
  usersMap: any = {}


  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: usuarioserviceService,
    private eventoService: EventosServiceService,
    public alertController: AlertController,
    private http: HttpClient) { }

  async ngOnInit() {
    this.eventos = await this.eventoService.getAllEvents()
    this.eventId = this.route.snapshot.paramMap.get("eventoId")
    this.evento = await this.eventoService.getEventById(this.eventId)
    this.navegacion = this.route.snapshot.paramMap.get("navegacion")
    this.usuarioLoggeado = await this.usuarioService.getLoggedUser()
    this.usuario = await this.usuarioService.getUserById(this.evento.creador)
    this.descripcionActivo= true
    this.usersMap = await this.usuarioService.getAllUsuariosMap() 

    if (this.eventos.length == 0) {
      //cargamos desde el json
      await this.leerEventosJSON()
    }
  }
  async ionViewWillEnter() {
    this.eventos = await this.eventoService.getAllEvents()
    this.eventId = this.route.snapshot.paramMap.get("eventoId")
    this.evento = await this.eventoService.getEventById(this.eventId)
    this.navegacion = this.route.snapshot.paramMap.get("navegacion")
    this.usuarioLoggeado = await this.usuarioService.getLoggedUser()
    this.usuario = await this.usuarioService.getUserById(this.evento.creador)
    this.usersMap = await this.usuarioService.getAllUsuariosMap() 
  }
  async presentPopover(paso, numPaso) {

    const alert = await this.alertController.create({
      header: numPaso + '. ' + paso.titulo,
      subHeader: paso.tiempo,
      message: paso.descripcion,
    });

    await alert.present();
  }

  //Método para leer los eventos del json y guardarlos en la bbdd local
  leerEventosJSON() {
    this.http.get('assets/bbdd/eventos.json').pipe(map(async res => {
      for (var i = 0; i < 6; i++) {
        var evento = res[i]
        await this.eventoService.saveEvent(evento);
      }
      this.eventos = await this.eventoService.getAllEvents()

    })).subscribe()
  }

  visualizarUsuario(id: string) {
    if (id != this.usuarioLoggeado.id) {
      this.router.navigateByUrl('tabs/'+ this.navegacion +'/user-info/' + id +  '/' +  this.navegacion)
    }
    else {
      this.router.navigateByUrl('tabs/perfil')
    }
  }

  verDetalles() {
    this.descripcionActivo = !this.descripcionActivo
  }

  async addCalendar(userId, eventoId) {
    this.eventoService.addCalendar(userId, eventoId)
    //Obtenemos la evento de la UI
    var evento = this.eventos.find(evento => {
      return evento.id === eventoId
    })
    //Comprobamos que existe la evento, y actualizamos metiendo el like del usuario.
    if (evento) {
      
      evento.usuarios.push(userId)
      this.evento.usuarios = evento.usuarios
    }
  }

  async removeCalendar(userId, eventoId) {
    this.eventoService.removeCalendar(userId, eventoId)
    //Obtenemos la evento de la UI 
    var evento = this.eventos.find(evento => {
      return evento.id === eventoId
    })
    //Comprobamos que existe la evento, y actualizamos quitando el like del usuario.
    if (evento) {
      var likes = evento.usuarios.filter(user_id => {
        return user_id != userId
      })
      //Actualizamos los likes de la evento
      evento.usuarios = likes
      this.evento.usuarios = evento.usuarios

    }
  }



}

