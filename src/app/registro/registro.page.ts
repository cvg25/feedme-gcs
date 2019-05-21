import { Component, OnInit } from '@angular/core';
import { usuarioserviceService } from '../user/user-service.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../user/user.model';
import { LoginServiceService } from '../login/login-service.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  onRegisterForm: any
  errorMessage: string
  imagenUsuario: string

  constructor(
    private usuarioService: usuarioserviceService,
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginServiceService) { }

  ngOnInit() {
    this.onRegisterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
    })
    this.imagenUsuario = "assets/images/users/user-anonimo.png"
  }

  ionViewWillEnter() {
    this.onRegisterForm.reset()
    this.errorMessage = ''
  }

  async tryRegister() {
    //Leemos los campos del formulario
    var usuario: User = {
      id: '',
      nombre: this.onRegisterForm.value['name'],
      username: this.onRegisterForm.value['username'],
      email: this.onRegisterForm.value['email'],
      password: this.onRegisterForm.value['password'],
      recetas: [],
      seguidores: [],
      seguidos: [],
      eventos: [],
      imagen: "assets/images/users/nuevo_usuario.jpeg"
    }
    //Guardamos al usuario
    await this.usuarioService.saveUser(usuario)
    //Loggeamos al usuario
    await this.loginService.loginUser(usuario.email, usuario.password)
    //Comprobamos si se ha iniciado sesion
    var isLoggedIn = await this.loginService.isLoggedIn()
    //Si se ha iniciado sesion redireccionamos a inicio
    if (isLoggedIn) {
      await this.goToInicio()
    } else {
      this.errorMessage = 'No se ha podido completar el proceso de registro. Inténtelo de nuevo.'
    }
  }

  async goToInicio() {
    await this.router.navigateByUrl('/tabs/inicio')
  }

  takePhoto(){
    this.imagenUsuario = "assets/images/users/nuevo_usuario.jpeg"
  }


}
