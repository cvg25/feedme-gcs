import { Component, OnInit } from '@angular/core';
import { User } from '../user/user.model';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login/login-service.service';
import { usuarioserviceService } from '../user/user-service.service';
import { RecipeServiceService } from '../recipe/recipe-service.service';
import { EventosServiceService } from '../events/eventos-service.service'
import { Recipe } from '../recipe/recipe.model'
import { Evento } from '../events/evento.model'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: User;
  recetas: Recipe[] = []
  eventos: Evento[] = []
  mostrarRecetas: boolean

  constructor(
    private router: Router,
    private loginService: LoginServiceService, 
    private usuarioService: usuarioserviceService,
    private recipeService : RecipeServiceService,
    private eventoService: EventosServiceService) { }

  async ngOnInit() {
    this.usuario = await this.usuarioService.getLoggedUser()
    this.recetas = await this.recipeService.getAllRecipesByUserId(this.usuario.id)
    this.eventos = await this.eventoService.getUserIdEvents(this.usuario.id)
    this.mostrarRecetas = true
  }

  async ionViewWillEnter() {
    this.usuario = await this.usuarioService.getLoggedUser()
    this.recetas = await this.recipeService.getAllRecipesByUserId(this.usuario.id)
    this.eventos = await this.eventoService.getUserIdEvents(this.usuario.id)
   }

   showRecetas(){
    this.mostrarRecetas = true
   }

   showEventos(){
    this.mostrarRecetas = false
   }

  async tryLogout() {
    //Hacemos el logout del usuario
    await this.loginService.logoutUser();

    //Comprobamos que el usuario ya no esta logeado.
    var isLoggedIn = await this.loginService.isLoggedIn()

    //Si ya no está loggeado, lo redirigimos a login.
    if (!isLoggedIn) {
      this.router.navigateByUrl('/login')
    }
  }

  visualizarReceta(id: string) {
    this.router.navigateByUrl('tabs/perfil/recipe-info/' + id + '/perfil')
  }

  visualizarEvento(id: string) {
    this.router.navigateByUrl('tabs/perfil/evento-info/' + id + '/perfil' )
  }
  
  verSeguidos(usuario_id: string) {
    this.router.navigateByUrl('tabs/perfil/seguidos/' + usuario_id)
  }

  verSeguidores(usuario_id: string) {
    this.router.navigateByUrl('tabs/perfil/seguidores/' + usuario_id)
  }
}
