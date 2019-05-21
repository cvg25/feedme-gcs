import { Component } from '@angular/core';
import { usuarioserviceService } from '../../user/user-service.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/user/user.model';
import { Router } from '@angular/router'

@Component({
  selector: 'app-seguidores',
  templateUrl: './seguidores.page.html',
  styleUrls: ['./seguidores.page.scss'],
})
export class SeguidoresPage{

  usuario: User
  seguidores: User[]

  constructor(
    private usuarioService: usuarioserviceService,
    private route: ActivatedRoute,
    private router: Router) { 
      this.seguidores = []
      this.usuario = {
        id: '',
        nombre: '',
        username: '',
        email: '',
        password: '',
        recetas: [],
        seguidores: [],
        seguidos: [],
        eventos: [],
        imagen: ''
      }
    }

  async ionViewWillEnter() {
    var usuario_id = this.route.snapshot.paramMap.get("usuarioId")
    this.usuario = await this.usuarioService.getLoggedUser()
    this.seguidores = await this.usuarioService.getSeguidoresByUserId(usuario_id)
  }

  async dejarDeSeguir(seguido_id) {
    await this.usuarioService.dejarDeSeguir(this.usuario.id, seguido_id)
    this.usuario = await this.usuarioService.getUserById(this.usuario.id)
  }

  async seguir(seguido_id) {
    await this.usuarioService.seguir(this.usuario.id, seguido_id)
    this.usuario = await this.usuarioService.getUserById(this.usuario.id)
  }

  visualizarUsuario(id: string) {
    if (this.usuario.id != id){
      this.router.navigateByUrl('tabs/inicio/user-info/' + id)
    }
    else{
      this.router.navigateByUrl('tabs/perfil')
    }
  }
}
