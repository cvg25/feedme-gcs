import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'inicio', loadChildren: './inicio/inicio.module#InicioPageModule' },
  { path: 'publicar', loadChildren: './publicar/publicar.module#PublicarPageModule' },
  //{ path: 'eventos', loadChildren: './eventos/eventos.module#EventosPageModule' },
  { path: 'perfil', loadChildren: './perfil/perfil.module#PerfilPageModule' },
  { path: 'recipe-comments', loadChildren: './recipe/recipe-comments/recipe-comments.module#RecipeCommentsPageModule' },
  { path: 'recipe-seguir-pasos', loadChildren: './recipe/recipe-seguir-pasos/recipe-seguir-pasos.module#RecipeSeguirPasosPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'registro', loadChildren: './registro/registro.module#RegistroPageModule' },
  { path: 'seguidores', loadChildren: './followers/seguidores/seguidores.module#SeguidoresPageModule' },
  { path: 'seguidos', loadChildren: './followers/seguidos/seguidos.module#SeguidosPageModule' },
  { path: 'eventos', loadChildren: './events/eventos/eventos.module#EventosPageModule' },
  { path: 'crear-evento', loadChildren: './events/crear-evento/crear-evento.module#CrearEventoPageModule' },
  { path: 'mis-eventos', loadChildren: './events/mis-eventos/mis-eventos.module#MisEventosPageModule' },
  { path: 'info', loadChildren: './events/info/info.module#InfoPageModule' },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
