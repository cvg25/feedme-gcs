import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class usuarioserviceService {

  constructor(private storage: Storage) { }

  async saveUser(usuario: User) {
    var numero_usuario = await this.storage.get('num_usuarios')
    // Comprobamos si ya hay usuarios
    if (numero_usuario == undefined || numero_usuario == null) {

      // Como no hay usuarios inicializamos el numero de usuarios a 1
      numero_usuario = 1
      await this.storage.set('num_usuarios', numero_usuario);
    }
    else {
      // Como ya hay usuarios actualizamos la cantidad total
      numero_usuario++
      await this.storage.set('num_usuarios', numero_usuario);
    }

    // Obtenemos el id del usuario a crear y lo guardamos
    var id_usuario = 'user_' + numero_usuario
    // Actualizamos el id del usuario
    usuario.id = id_usuario
    // Guardamos el usuario en el storage
    this.storage.set(id_usuario, usuario)
  }

  async actualizarUser(user){
    await this.storage.set(user.id, user)
  }

  async getAllUsuarios(): Promise<User[]> {
    var usuarios: User[] = []

    var numero_usuarios = await this.storage.get('num_usuarios')
    // Comprobamos si hay usuarios
    if (numero_usuarios !== undefined) {
      // Recorremos las usuarios, las obtenemos y las añadimos al array
      for (var i = 1; i < numero_usuarios + 1; i++) {
        var usuario_obtenido = await this.storage.get('user_' + i)
        usuarios.push(usuario_obtenido)
      }
    }

    return usuarios
  }


  async getAllUsuariosMap() {
    var users = await this.getAllUsuarios()

    var usersMap = await users.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {})

    return usersMap
  }

  async getUserById(user_id): Promise<User> {
    return await this.storage.get(user_id)
  }

  async getLoggedUser(): Promise<User> {
    var logged_user_id = await this.storage.get('logged_user')
    return await this.getUserById(logged_user_id)
  }

  async getSeguidoresByUserId(user_id): Promise<User[]> {
    var seguidores: User[] = []
    var user : User = await this.getUserById(user_id)
    if(user) {
      user.seguidores.map(async seguidor_id => {
        var seguidor = await this.getUserById(seguidor_id)
        seguidores.push(seguidor)
      })
    }

    return seguidores
  }

  async getSeguidosByUserId(user_id): Promise<User[]> {
    var seguidos: User[] = []
    var user: User = await this.getUserById(user_id)
    if(user) {
      user.seguidos.map(async seguido_id => {
        var seguido = await this.getUserById(seguido_id)
        seguidos.push(seguido)
      })
    }
    return seguidos
  }

  async dejarDeSeguir(usuario_id, seguido_id) {
    var user: User = await this.getUserById(usuario_id)
    if(user) {
      var index = user.seguidos.indexOf(seguido_id)
      if(index != -1) {
        user.seguidos.splice(index, 1)
        await this.storage.set(usuario_id, user)

        var seguido: User = await this.getUserById(seguido_id)
        index = seguido.seguidores.indexOf(usuario_id)
        if(index != -1) {
          seguido.seguidores.splice(index, 1)
          await this.storage.set(seguido_id, seguido)
        }
      }
    }
  }

  async seguir(usuario_id, seguido_id) {
    var user: User = await this.getUserById(usuario_id)
    if(user) {
      var index = user.seguidos.indexOf(seguido_id)
      if(index == -1) {
        user.seguidos.push(seguido_id)
        await this.storage.set(usuario_id, user)

        var seguido: User = await this.getUserById(seguido_id)
        index = seguido.seguidores.indexOf(usuario_id)
        if(index == -1) {
          seguido.seguidores.push(usuario_id)
          await this.storage.set(seguido_id, seguido)
        }

      }
    }
  }
}
