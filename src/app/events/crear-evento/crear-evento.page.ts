import { Component, OnInit } from '@angular/core';
import { Visibilidad, Evento } from '../evento.model'

import { usuarioserviceService } from '../../user/user-service.service'
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, NgForm } from '@angular/forms';

import { EventosServiceService } from '../eventos-service.service'
import { User } from '../../user/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

  onDatosBasicosForm: any
  usuario: User;
  visibilidades: any[] = [];
  ingredientes: string[];
  evento: Evento;
  Visibilidad = Visibilidad
  idNuevoEvento: string;


  datosBasicosRecetaCompletados: boolean
  ingredientesRecetaCompletados: boolean
  pasosRecetaCompletados: boolean

  imagenEvento1: string
  imagenEvento2: string
  imagenEvento3: string



  constructor(private eventoService: EventosServiceService,
    private userService: usuarioserviceService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder) {
    
      this.visibilidades = Object.keys(Visibilidad).filter(key => Number(key) >= 0)

    }

  async ngOnInit() {


    this.onDatosBasicosForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.required]],
      descripcion: ['', [Validators.required]],
      visibilidad: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
    })
    this.eventoService.getAllEvents().then(res => {
      this.idNuevoEvento = "evento_" + (res.length + 1)
    })

    this.usuario = await this.userService.getLoggedUser()

  }

  ionViewWillEnter() {
    this.onDatosBasicosForm.reset()
    this.imagenEvento1 = "assets/images/recetas/defecto.png"
    this.imagenEvento2 = "assets/images/recetas/defecto.png"
    this.imagenEvento3 = "assets/images/recetas/defecto.png"
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

  async crearEvento() {
    //Leemos los campos del formulario
    this.evento = {
      id: this.idNuevoEvento,
      fechaRealizacion: this.onDatosBasicosForm.value['tiempo'],
      titulo: this.onDatosBasicosForm.value['titulo'],
      descripcion: this.onDatosBasicosForm.value['descripcion'],
      creador: this.usuario.id,
      usuarios: [],
      visibilidad: this.onDatosBasicosForm.value['visibilidad'],
      imagenes: ["assets/images/eventos/nuevo_evento1.jpg", "assets/images/eventos/nuevo_evento2.jpg"],
      fecha: this.obtenerFecha()
    }
    //Guardamos la receta
    await this.eventoService.saveEvent(this.evento)
    //Asignamos la receta al usuario
    this.usuario.eventos.push(this.evento.id)
    this.userService.actualizarUser(this.usuario)


    await this.router.navigateByUrl('/tabs/eventos')
    this.onDatosBasicosForm.reset()

  }

  takePhoto1(){
    this.imagenEvento1 = "assets/images/eventos/nuevo_evento1.jpg"
  }

  takePhoto2(){
    this.imagenEvento2 = "assets/images/eventos/nuevo_evento2.jpg"
  }
}
