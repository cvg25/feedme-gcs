import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { usuarioserviceService } from '../user/user-service.service';
import { RecipeServiceService } from '../recipe/recipe-service.service'
import { User } from '../user/user.model';
import { Router } from '@angular/router';
import { Recipe, Dificultad, Categoria, PasoReceta } from '../recipe/recipe.model';
import { tick } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
})
export class PublicarPage implements OnInit {

  onDatosBasicosForm: any
  onAddIngredientesForm: any
  onAddPasosForm: any
  usuario: User;
  pasos: PasoReceta[] = []
  ingredientes: string[] = []
  recetaCreada: Recipe;

  dificultades: any[] = [];
  categorias: any[] = [];
  Dificultad = Dificultad;
  Categoria = Categoria;
  idNuevaReceta: string;

  datosBasicosRecetaCompletados: boolean
  ingredientesRecetaCompletados: boolean
  pasosRecetaCompletados: boolean

  imagenUsuario1: string
  imagenUsuario2: string
  imagenUsuario3: string

  constructor(
    private usuarioService: usuarioserviceService,
    private recipeService: RecipeServiceService,
    private router: Router,
    private fb: FormBuilder,
    public alertController: AlertController) {
    this.dificultades = Object.keys(Dificultad).filter(key => Number(key) >= 0);
    this.categorias = Object.keys(Categoria).filter(key => Number(key) >= 0)
  }

  async ngOnInit() {

    this.onDatosBasicosForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      dificultad: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
    })

    this.onAddIngredientesForm = this.fb.group({
      ingrediente: ['', [Validators.required]]
    })

    this.onAddPasosForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      tiempo: ['', []],
    })

    this.datosBasicosRecetaCompletados = true
    this.usuario = await this.usuarioService.getLoggedUser()
    this.recipeService.getAllRecipes().then(res => {
      this.idNuevaReceta = "receta_" + (res.length + 1)
    })


  }

  ionViewWillEnter() {
    this.onDatosBasicosForm.reset()
    this.onAddIngredientesForm.reset()
    this.ingredientes = []
    this.pasos = []
    this.imagenUsuario1 = "assets/images/recetas/defecto.png"
    this.imagenUsuario2 = "assets/images/recetas/defecto.png"
    this.imagenUsuario3 = "assets/images/recetas/defecto.png"
  }


  obtenerFecha(): string {
    var fecha = new Date();
    var anyo = fecha.getFullYear().toString()
    var mes = ''
    if (fecha.getUTCMonth() + 1 < 10) { mes = '0' }
    mes += (fecha.getUTCMonth() + 1).toString()

    var dia = ''
    if (fecha.getDate() < 10) { dia = '0' }
    dia += fecha.getDate().toString()

    var nuevaFecha = dia + '-' + mes + '-' + anyo
    return nuevaFecha
  }

  async guardarReceta() {
    //Leemos los campos del formulario
    this.recetaCreada = {
      id: this.idNuevaReceta,
      fechaCreacion: this.obtenerFecha(),
      ingredientes: this.ingredientes,
      titulo: this.onDatosBasicosForm.value['titulo'],
      descripcion: this.onDatosBasicosForm.value['descripcion'],
      dificultad: this.onDatosBasicosForm.value['dificultad'],
      tiempo: this.onDatosBasicosForm.value['tiempo'],
      categoria: this.onDatosBasicosForm.value['categoria'],
      pasos: this.pasos,
      userId: this.usuario.id,
      comentarios: [],
      likes: [],
      imagenes: ["assets/images/recetas/receta_pordefecto_1.jpg", "assets/images/recetas/receta_pordefecto_2.jpg"]
    }
    //Guardamos la receta
    await this.recipeService.saveRecipe(this.recetaCreada)
    //Asignamos la receta al usuario
    this.usuario.recetas.push(this.recetaCreada.id)
    this.usuarioService.actualizarUser(this.usuario)

    this.goToInicio()
  }

  goToIngredientes() {
    this.datosBasicosRecetaCompletados = false;
    this.ingredientesRecetaCompletados = true;
    this.pasosRecetaCompletados = false;
  }

  goToPasos() {
    this.datosBasicosRecetaCompletados = false;
    this.ingredientesRecetaCompletados = false;
    this.pasosRecetaCompletados = true;
  }

  goToDatos() {
    this.datosBasicosRecetaCompletados = true;
    this.ingredientesRecetaCompletados = false;
    this.pasosRecetaCompletados = false;
  }

  async goToInicio() {
    await this.router.navigateByUrl('/tabs/inicio')
    this.goToDatos()
    this.onDatosBasicosForm.reset()

  }

  addIngrediente() {
    var ingrediente = this.onAddIngredientesForm.value['ingrediente']
    this.ingredientes.push(ingrediente)

    this.onAddIngredientesForm.reset()
  }

  addPaso() {
    var paso: PasoReceta = {
      titulo: this.onAddPasosForm.value['titulo'],
      descripcion: this.onAddPasosForm.value['descripcion'],
      tiempo: this.onAddPasosForm.value['tiempo'],
    }
    this.pasos.push(paso)

    this.onAddPasosForm.reset()
  }

  removeIngrediente(index) {
    this.ingredientes.splice(index, 1)
  }

  removePaso(index) {
    this.ingredientes.splice(index, 1)
  }

  takePhoto1(){
    this.imagenUsuario1 = "assets/images/recetas/receta_pordefecto_1.jpg"
  }

  takePhoto2(){
    this.imagenUsuario2 = "assets/images/recetas/receta_pordefecto_2.jpg"
  }

  async presentPopover(paso, numPaso) {

    const alert = await this.alertController.create({
      header: numPaso + ' ' + paso.titulo,
      subHeader: paso.tiempo,
      message: paso.descripcion,
    });

    await alert.present();
  }
}
