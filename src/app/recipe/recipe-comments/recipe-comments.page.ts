import { Component, OnInit, ViewChild } from '@angular/core';
import { Recipe, Categoria, Dificultad, Comentario } from '../recipe.model';
import { User } from 'src/app/user/user.model';
import { usuarioserviceService } from 'src/app/user/user-service.service';
import { RecipeServiceService } from '../recipe-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular'

@Component({
  selector: 'app-recipe-comments',
  templateUrl: './recipe-comments.page.html',
  styleUrls: ['./recipe-comments.page.scss'],
})
export class RecipeCommentsPage  {
  @ViewChild(IonContent) private content: IonContent;

  receta: Recipe
  recipeId: string

  usersMap: any = {}

  nuevoComentario: string = ''
  comentarios: Comentario[] = []

  noText: boolean = true

  usuarioLogeado: any

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeServiceService,
    private usuarioService: usuarioserviceService,
    private router: Router) { }

  async ionViewWillEnter() {
    this.recipeId = this.route.snapshot.paramMap.get("recetaId")
    this.usersMap = await this.usuarioService.getAllUsuariosMap() 
    this.receta = await this.recipeService.getRecipeById(this.recipeId)
    this.usuarioLogeado = await this.usuarioService.getLoggedUser()
    this.ordenaComentarios()
  }

  escribirComentario(){
    if (this.nuevoComentario == ''){
      this.noText = true
    }
    else{
      this.noText = false
    }
  }

  async ordenaComentarios(){
    this.comentarios = await this.receta.comentarios
  }

  async guardarComentario(){
    
    this.usersMap[this.usuarioLogeado.id] = this.usuarioLogeado

    var fecha = new Date(); 
    var anyo = fecha.getFullYear().toString()
    var mes = ''
    if(fecha.getUTCMonth() + 1 < 10){
      mes = '0'
    }
    mes += (fecha.getUTCMonth() + 1).toString()
   
    var dia = ''
    if(fecha.getDate() < 10){
      dia = '0'
    }
     dia += fecha.getDate().toString()
   
    var nuevaFecha = dia + '-' + mes + '-' + anyo

    
    var comentario: Comentario =  {
      mensaje:  this.nuevoComentario,
      userId : this.usuarioLogeado.id,
      fecha: nuevaFecha
    }

    if(this.nuevoComentario != ""){
      await this.recipeService.addComment(comentario, this.recipeId)
      this.receta = await this.recipeService.getRecipeById(this.recipeId)
      this.ordenaComentarios()
      this.nuevoComentario = ""
      this.scrollToBottom()
    }
    
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 300)
  }

  visualizarUsuario(id: string){
    if (this.usuarioLogeado.id != id){
      this.router.navigateByUrl('tabs/inicio/user-info/' + id)
    }
  }
}
