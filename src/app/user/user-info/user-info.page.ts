import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { usuarioserviceService } from '../user-service.service';
import { User } from '../user.model';
import { Recipe } from 'src/app/recipe/recipe.model';
import { RecipeServiceService } from 'src/app/recipe/recipe-service.service';
import { EventosServiceService } from '../../events/eventos-service.service'
import { Router } from '@angular/router';
import { Evento } from 'src/app/events/evento.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit{

  loggedUser: User
  usuario: User
  recetas: Recipe[] = []
  eventos: Evento[] = []
  mostrarRecetas: boolean

  constructor(
    private route: ActivatedRoute, 
    private usuarioService: usuarioserviceService, 
    private recetaService: RecipeServiceService,
    private router: Router,
    private eventoService: EventosServiceService) { 
      this.usuario = {
        id: '',
        nombre: '',
        username: '',
        email: '',
        password: '',
        recetas: [],
        seguidores: [],
        seguidos: [],
        eventos: [],
        imagen: ''
      }
      this.loggedUser = {
        id: '',
        nombre: '',
        username: '',
        email: '',
        password: '',
        recetas: [],
        seguidores: [],
        seguidos: [],
        eventos: [],
        imagen: ''
      }
    }

    ngOnInit(){
      this.mostrarRecetas = true
    }

  async ionViewWillEnter() {
    var userId = this.route.snapshot.paramMap.get("usuarioId")
    this.usuario = await this.usuarioService.getUserById(userId)
    this.recetas = await this.recetaService.getAllRecipesByUserId(userId)
    this.loggedUser = await this.usuarioService.getLoggedUser()
    this.eventos = await this.eventoService.getUserIdEvents(userId)
  }

  visualizarReceta(id: string) {
    this.router.navigateByUrl('tabs/inicio/recipe-info/' + id + '/inicio')
  }

  verSeguidos(usuario_id: string) {
    this.router.navigateByUrl('tabs/inicio/seguidos/' + usuario_id)
  }

  verSeguidores(usuario_id: string) {
    this.router.navigateByUrl('tabs/inicio/seguidores/' + usuario_id)
  }

  showRecetas(){
    this.mostrarRecetas = true
   }

   showEventos(){
    this.mostrarRecetas = false
   }

   visualizarEvento(id: string) {
    this.router.navigateByUrl('tabs/inicio/evento-info/' + id + '/inicio' )
  }

  async dejarDeSeguir(seguido_id) {
    await this.usuarioService.dejarDeSeguir(this.loggedUser.id, seguido_id)
    this.loggedUser = await this.usuarioService.getUserById(this.loggedUser.id)
    this.usuario = await this.usuarioService.getUserById(seguido_id)
  }

  async seguir(seguido_id) {
    await this.usuarioService.seguir(this.loggedUser.id, seguido_id)
    this.loggedUser = await this.usuarioService.getUserById(this.loggedUser.id)
    this.usuario = await this.usuarioService.getUserById(seguido_id)
  }

}
