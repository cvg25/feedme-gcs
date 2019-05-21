import { Component, OnInit } from '@angular/core';
import { RecipeServiceService } from '../recipe-service.service';
import { Recipe, Categoria, Dificultad } from '../recipe.model';
import { User } from 'src/app/user/user.model';
import { usuarioserviceService } from 'src/app/user/user-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import {IonSlides} from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular'
import { AlertController } from '@ionic/angular';




@Component({
  selector: 'app-recipe-seguir-pasos',
  templateUrl: './recipe-seguir-pasos.page.html',
  styleUrls: ['./recipe-seguir-pasos.page.scss'],
})
export class RecipeSeguirPasosPage  {
  @ViewChild(IonSlides) slides: IonSlides;
numeroPaso: number = 0
  totalPasos: number

  receta: Recipe
  usuario: User
  recipeId: string

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  

  constructor( 
    private route: ActivatedRoute, 
    private recipeService: RecipeServiceService,  
    private usuarioService: usuarioserviceService,
    private navCtrl: NavController,
    public alertController: AlertController) { }

  
  async ionViewWillEnter() {
    this.recipeId = this.route.snapshot.paramMap.get("recetaId")
    this.receta = await this.recipeService.getRecipeById(this.recipeId)
    this.usuario = await this.usuarioService.getUserById(this.receta.userId)
    this.totalPasos = this.receta.pasos.length
  }

  terminarElaboracion(){
    this.navCtrl.pop()
  }

  async presentAlert(paso, numPaso) {

    const alert = await this.alertController.create({
      header: '¡Es hora de comer!',
      message: 'No olvides dejar tu comentario y un like para apoyar al creador',
      mode: "ios",
      buttons: [
        {
          text: 'OK',
          handler: () => {this.terminarElaboracion()}
        }
      ]
    });

    await alert.present();
  }

  async updateNumeroPaso(){
    this.numeroPaso = await this.slides.getActiveIndex()

    if (this.numeroPaso==-1){
      this.numeroPaso++
    }

    if (this.numeroPaso==this.totalPasos+1){
      this.numeroPaso--
    }
  }

  next() {
    this.numeroPaso++
    this.slides.slideNext();
  }

  prev() {
    this.numeroPaso--
    this.slides.slidePrev();
  }

}
