import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeServiceService } from '../recipe-service.service';
import { Recipe, Categoria, Dificultad } from '../recipe.model';
import { User } from 'src/app/user/user.model';
import { usuarioserviceService } from 'src/app/user/user-service.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.page.html',
  styleUrls: ['./recipe-info.page.scss'],
})
export class RecipeInfoPage {
  navegacion: string

  receta: Recipe
  usuario: User
  recipeId: string
  usuarioLoggeado: User

  descripcionActivo: boolean
  ingredientesActivo: boolean
  pasosActivo: boolean
  Dificultad = Dificultad;
  Categoria = Categoria;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeServiceService, 
    private router: Router,
    private usuarioService: usuarioserviceService,
    public alertController: AlertController) { }

  async ionViewWillEnter() {
    this.navegacion = this.route.snapshot.paramMap.get("navegacion")
    this.recipeId = this.route.snapshot.paramMap.get("recetaId")
    this.receta = await this.recipeService.getRecipeById(this.recipeId)
    this.usuario = await this.usuarioService.getUserById(this.receta.userId)
    this.usuarioLoggeado = await this.usuarioService.getLoggedUser()
    this.descripcionActivo = true
  }

  async presentPopover(paso, numPaso) {

    const alert = await this.alertController.create({
      header: numPaso + '. ' + paso.titulo,
      subHeader: paso.tiempo,
      message: paso.descripcion,
    });

    await alert.present();
  }

  visualizarUsuario(id: string){
    this.verDescripcion()
    if (this.usuario.id != this.usuarioLoggeado.id){
      this.router.navigateByUrl('tabs/inicio/user-info/' + id)
    }
    else{
      this.router.navigateByUrl('tabs/perfil')
    }
  }

  verDescripcion(){
    this.descripcionActivo = true
    this.ingredientesActivo = false
    this.pasosActivo = false
  }

  verIngredientes(){
    this.ingredientesActivo = true
    this.descripcionActivo = false
    this.pasosActivo = false
  }

  verPasos(){
    this.pasosActivo = true
    this.descripcionActivo = false
    this.ingredientesActivo = false
  }

  async addLike(userId, recetaId) {
    this.recipeService.addLike(userId, recetaId)
   
    //Comprobamos que existe la receta, y actualizamos metiendo el like del usuario.
    if (this.receta) {
      this.receta.likes.push(userId)
    }
  }

  removeLike(userId, recetaId) {
    this.recipeService.removeLike(userId, recetaId)
 
    //Comprobamos que existe la receta, y actualizamos quitando el like del usuario.
    if (this.receta) {
      var likes = this.receta.likes.filter(user_id => {
        return user_id != userId
      })
      //Actualizamos los likes de la receta
      this.receta.likes = likes
    }
  }

  visualizarComentariosReceta(id: string){
    this.verDescripcion()
    this.router.navigateByUrl('tabs/' + this.navegacion + '/recipe-comments/' + id)
  }

  visualizarSeguirPasos(id: string){
    this.verDescripcion()
    this.router.navigateByUrl('tabs/'+ this.navegacion+'/recipe-seguir-pasos/' + id)
  }
}
