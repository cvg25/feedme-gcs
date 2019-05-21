import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Evento } from './evento.model'

@Injectable({
  providedIn: 'root'
})
export class EventosServiceService {

  constructor(private storage: Storage) { }

  async saveEvent (evento: Evento) { 
    var numero_evento = await this.storage.get('num_eventos')
    // Comprobamos si ya hay eventos
    if (numero_evento === undefined || numero_evento === null ||numero_evento<1) {

      // Como no hay eventos inicializamos el numero de eventos a 1
      numero_evento = 1
      await this.storage.set('num_eventos', numero_evento);
    }
    else {
      // Como ya hay eventos actualizamos la cantidad total
      numero_evento++
      await this.storage.set('num_eventos', numero_evento);
    }

    // Obtenemos el id del evento a crear y la guardamos
    var id_evento = 'evento_' + numero_evento
    this.storage.set(id_evento, evento)  
  }

  async getAllEvents(): Promise<Evento[]> {
    var eventos: Evento[] = []

    var numero_eventos = await this.storage.get('num_eventos')
    // Comprobamos si hay eventos
    if (numero_eventos !== undefined && numero_eventos!== null && numero_eventos > 0) {
      // Recorremos las eventos, las obtenemos y las añadimos al array
      for (var i = 1; i < numero_eventos+1; i++) {
        var evento_obtenido = await this.storage.get('evento_' + i)
        eventos.push(evento_obtenido)
      }
    }
    eventos.sort((a, b) => a.fecha <= b.fecha ? 1 : -1)
    return eventos
  }
  
  async getEventById(evento_id) : Promise<Evento>{
    return await this.storage.get(evento_id)
  }

  async getUserIdEvents (user_id) : Promise<Evento[]> {
    var eventos : Evento[] = []
    var user = await this.storage.get(user_id)
    if(user === undefined) {
      return eventos
    } 

    if(user.eventos && user.eventos.length > 0) {
      user.eventos.map(async (evento_id) => {
        var evento = await this.storage.get(evento_id);
        eventos.push(evento)
      })
    }

    return eventos
  } 

  async getUserIdCalendar(user_id): Promise<Evento[]> {
    var eventos: Evento[] = []
    var user = await this.storage.get(user_id)
    if (user === undefined) {
      return eventos
    }

    if (user.eventos && user.eventos.length > 0) {
      user.eventos.map(async (evento_id) => {
        var evento = await this.storage.get(evento_id);
        eventos.push(evento)
      })
    }

    var numero_eventos = await this.storage.get('num_eventos')
    // Comprobamos si hay eventos
    if (numero_eventos !== undefined && numero_eventos !== null && numero_eventos > 0) {
     
      // Recorremos las eventos, las obtenemos y las añadimos al array
      for (var i = 1; i < numero_eventos + 1; i++) {
        var evento_obtenido = await this.storage.get('evento_' + i)
       
        if (evento_obtenido.usuarios.some(x => x === user_id))
          eventos.push(evento_obtenido)
      }
    }
    
    var fechaActual = this.obtenerFecha();
    eventos.sort((a, b) => a.fechaRealizacion <= b.fechaRealizacion ? -1 : 1)
    var filtered = eventos.filter(function (value, index, arr) {

      return value.fechaRealizacion >= fechaActual;

    });
    return filtered
  } 

  obtenerFecha(): string {
    var fecha = new Date();
    var anyo = fecha.getFullYear().toString()
    var mes = ''
    if (fecha.getUTCMonth() + 1 < 10) { mes = '0' }
    mes += (fecha.getUTCMonth() + 1).toString()

    var dia = ''
    if (fecha.getDate() + 1 < 10) { dia = '0' }
    dia += fecha.getDate().toString()

    var nuevaFecha = anyo + '-' + mes + '-' + dia
    return nuevaFecha
  }

  async addCalendar(usuarioId, eventoId) {
    var evento: Evento

    evento = await this.getEventById(eventoId)
    var user = await this.storage.get(usuarioId)
    if (user === undefined) {
      return 
    }
    evento.usuarios.push(usuarioId)
    //user.calendaio.push(usuarioId)

    await this.storage.set(eventoId, evento);
  }

  async removeCalendar(usuarioId, eventoId) {
    var evento: Evento

    evento = await this.getEventById(eventoId)
    //var user = await this.storage.get(usuarioId)

    var pos = evento.usuarios.indexOf(usuarioId)
    //var pos2 = user.calendario.indexOf(eventoId)
    evento.usuarios.splice(pos, 1)
    //user.calendaio.splice(pos2, 1)

    await this.storage.set(eventoId, evento);
  }
}
