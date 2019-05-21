import { Injectable } from '@angular/core';
import { Recipe } from '../recipe/recipe.model';
import { Storage } from '@ionic/storage';
import { usuarioserviceService } from '../user/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeServiceService {

  constructor(
    private storage: Storage,
    private usuarioService: usuarioserviceService) { }


  async saveRecipe(receta: Recipe) {

    var numero_receta = await this.storage.get('num_recetas')

    // Comprobamos si ya hay recetas
    if (numero_receta == undefined || numero_receta == null) {
      // Como no hay recetas inicializamos el numero de recetas a 1
      numero_receta = 1
      await this.storage.set('num_recetas', numero_receta);
    }
    else {
      // Como ya hay recetas actualizamos la cantidad total
      numero_receta++
      await this.storage.set('num_recetas', numero_receta);
    }

    // Obtenemos el id de la receta a crear y la guardamos
    var id_receta = 'receta_' + numero_receta

    this.storage.set(id_receta, receta)
  }

  async getAllRecipes(): Promise<Recipe[]> {

    var recipes: Recipe[] = []

    var numero_recetas = await this.storage.get('num_recetas')
    // Comprobamos si hay recetas
    if (numero_recetas !== undefined) {
      // Recorremos las recetas, las obtenemos y las añadimos al array
      for (var i = numero_recetas; i > 0; i--) {
        var receta_obtenida = await this.storage.get('receta_' + i)
        recipes.push(receta_obtenida)
      }
    }
    return recipes
  }

  async getRecipeById(receta_id): Promise<Recipe> {
    return await this.storage.get(receta_id)
  }

  async getAllRecipesByUserId(user_id): Promise<Recipe[]> {
    var recetas: Recipe[] = []

    var usuario = await this.usuarioService.getUserById(user_id)

    usuario.recetas.map(async (recipeId) => {
      var receta = await this.getRecipeById(recipeId)
      recetas.push(receta)
    })

    return recetas
  }

  async addComment(comentario, recetaId) {
    var receta: Recipe

    receta = await this.getRecipeById(recetaId)
    receta.comentarios.push(comentario)

    await this.storage.set(recetaId, receta);
  }

  async addLike(usuarioId, recetaId) {
    var receta: Recipe

    receta = await this.getRecipeById(recetaId)
    receta.likes.push(usuarioId)

    await this.storage.set(recetaId, receta);
  }

  async removeLike(usuarioId, recetaId) {
    var receta: Recipe

    receta = await this.getRecipeById(recetaId)
    var pos = receta.likes.indexOf(usuarioId)
    receta.likes.splice(pos, 1)

    await this.storage.set(recetaId, receta);
  }

}
