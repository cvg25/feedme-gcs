import { Component, OnInit, NgZone } from '@angular/core';
import { Recipe } from '../recipe/recipe.model'
import { Evento } from '../events/evento.model'
import { RecipeServiceService } from '../recipe/recipe-service.service'
import { usuarioserviceService } from '../user/user-service.service'
import { EventosServiceService } from '../events/eventos-service.service'
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { User } from '../user/user.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  recipes: Recipe[] = []
  eventos: Evento[] = []
  usersMap: any = {}
  usuarioLoggeado: User



  constructor(
    private recipeService: RecipeServiceService,
    private eventoService: EventosServiceService,
    private userService: usuarioserviceService,
    private router: Router,
    private http: HttpClient) { }

  async ngOnInit() {

    //Cargamos las recetas de la bd
    this.usersMap = await this.userService.getAllUsuariosMap()
    this.recipes = await this.recipeService.getAllRecipes()
    this.eventos = await this.eventoService.getAllEvents()
    this.usuarioLoggeado = await this.userService.getLoggedUser()

    //En caso de no existir ninguna en la bd, cargamos las recetas del json inicial (SE LEE EL JSON UNA SOLA VEZ AL INICIAR LA APP POR PRIMERA VEZ)
    if (this.recipes.length == 0) {
      //cargamos desde el json
      await this.leerRecetasJSON()
    }

    if (this.eventos.length == 0) {
      //cargamos desde el json
      await this.leerEventosJSON()
    }

  }

  async ionViewWillEnter() {
    this.recipes = await this.recipeService.getAllRecipes()
   }

  visualizarReceta(id: string) {
    this.router.navigateByUrl('tabs/inicio/recipe-info/' + id + '/inicio')
  }


  visualizarComentariosReceta(id: string) {
    this.router.navigateByUrl('tabs/inicio/recipe-comments/' + id)
  }

  visualizarUsuario(id: string) {
    if (this.usuarioLoggeado.id != id){
      this.router.navigateByUrl('tabs/inicio/user-info/' + id)
    }
    else{
      this.router.navigateByUrl('tabs/perfil')
    }
  }

  async addLike(userId, recetaId) {
    this.recipeService.addLike(userId, recetaId)
    //Obtenemos la receta de la UI
    var receta = this.recipes.find(receta => {
      return receta.id === recetaId
    })
    //Comprobamos que existe la receta, y actualizamos metiendo el like del usuario.
    if (receta) {
      receta.likes.push(userId)
    }
  }

  removeLike(userId, recetaId) {
    this.recipeService.removeLike(userId, recetaId)
    //Obtenemos la receta de la UI 
    var receta = this.recipes.find(receta => {
      return receta.id === recetaId
    })
    //Comprobamos que existe la receta, y actualizamos quitando el like del usuario.
    if (receta) {
      var likes = receta.likes.filter(user_id => {
        return user_id != userId
      })
      //Actualizamos los likes de la receta
      receta.likes = likes
    }
  }

  //Método para leer las recetas del json y guardarlas en la bbdd local
  leerRecetasJSON() {
    this.http.get('assets/bbdd/recipes.json').pipe(map(async res => {
      for (var i = 0; i < 8; i++) {
        var recipe = res[i]
        await this.recipeService.saveRecipe(recipe);
      }
      this.recipes = await this.recipeService.getAllRecipes()

    })).subscribe()
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


}
