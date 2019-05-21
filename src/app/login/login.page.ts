import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from './login-service.service';
import { usuarioserviceService } from '../user/user-service.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  onLoginForm: any
  errorMessage: string

  constructor(
    private router: Router,
    private loginService: LoginServiceService,
    private usuarioService: usuarioserviceService,
    private http: HttpClient,
    private fb: FormBuilder) {
    this.errorMessage = ''
  }

  async ngOnInit() {
    this.onLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })

    //Recuperamos la lista de usuarios.
    var listaUsuarios = await this.usuarioService.getAllUsuarios()
    //Si la lista de usuarios esta vacía, la cargamos desde el JSON.
    if (listaUsuarios.length == 0) {
      //cargamos desde el json los usuarios
      await this.leerUsuariosJSON()
    }

    //Comprobamos si el usuario está loggeado y si es así, le dejamos pasar.
    var isLoggedIn = await this.loginService.isLoggedIn()
    if (isLoggedIn) {
      this.goToInicio()
    }
  }

  ionViewWillEnter() {
    this.onLoginForm.reset()
  }

  //Método para leer los usuarios del json y guardarlos en la bbdd local
  leerUsuariosJSON() {
    this.http.get('assets/bbdd/users.json').pipe(map(async res => {
      for (var i = 0; i < 6; i++) {
        var user = res[i]
        await this.usuarioService.saveUser(user);
      }
    })).subscribe()
  }

  async goToInicio() {
    await this.router.navigateByUrl('/tabs/inicio')
  }

  async goToRegister() {
    await this.router.navigateByUrl('/registro')
  }

  async tryLogin() {
    var email = this.onLoginForm.value['email']
    var password = this.onLoginForm.value['password']

    //Intentamos loggear al usuario.
    await this.loginService.loginUser(email, password)
    //Comprobamos si el usuario se ha loggeado con exito.
    var isLoggedIn = await this.loginService.isLoggedIn()
    if (isLoggedIn) {
      await this.goToInicio()
      this.errorMessage = ''
    } else {
      this.errorMessage = 'Credenciales inválidas'
    }
  }
}
