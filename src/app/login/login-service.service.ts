import { Injectable } from '@angular/core';
import { usuarioserviceService } from '../user/user-service.service';
import { User } from '../user/user.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private storage: Storage, private usuarioService: usuarioserviceService) { }

  async logoutUser() {
    await this.storage.set("logged_user", undefined)
  }

  //Devuelve true si el usuario esta loggeado.
  async isLoggedIn(): Promise<Boolean> {
    var loggedUser = await this.storage.get("logged_user")
    if (loggedUser) {
      return true
    } else {
      return false
    }
  }

  //Intenta loggear un usuario.
  async loginUser(email: string, password: string) {
    //Recuperamos todos los usuarios.
    var listaUsuarios = await this.usuarioService.getAllUsuarios();

    //Metemos los usuarios en un map con clave el email.
    var usersMapEmailKey = listaUsuarios.reduce((map, user) => {
      map[user.email] = user
      return map
    }, {})

    //Comprobamos si el email introducido por el usuario, coincide con alguno de los existentes.
    var usuarioExiste: User = usersMapEmailKey[email]

    //Si coincide, comprobamos que la contraseña sea la valida.
    if (usuarioExiste && usuarioExiste.password == password) {
      //Si es valida, metemos al usuario en la sesion: "logged_user"
      await this.storage.set("logged_user", usuarioExiste.id)
    }
  }

}
