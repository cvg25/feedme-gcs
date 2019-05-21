import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        children: [
          {
            path: '',
            loadChildren: '../inicio/inicio.module#InicioPageModule'
          },
          {
            path: 'recipe-info/:recetaId/:navegacion',
            loadChildren: '../recipe/recipe-info/recipe-info.module#RecipeInfoPageModule'
          },
          {
            path: 'user-info/:usuarioId',
            loadChildren: '../user/user-info/user-info.module#UserInfoPageModule'
          },
          {
            path: 'user-info/:usuarioId/:navegacion',
            loadChildren: '../user/user-info/user-info.module#UserInfoPageModule'
          },
          {
            path: 'recipe-comments/:recetaId',
            loadChildren: '../recipe/recipe-comments/recipe-comments.module#RecipeCommentsPageModule'
          },
          {
            path: 'recipe-seguir-pasos/:recetaId',
            loadChildren: '../recipe/recipe-seguir-pasos/recipe-seguir-pasos.module#RecipeSeguirPasosPageModule'
          },
          {
            path: 'seguidores/:usuarioId',
            loadChildren: '../followers/seguidores/seguidores.module#SeguidoresPageModule'
          },
          {
            path: 'seguidos/:usuarioId',
            loadChildren: '../followers/seguidos/seguidos.module#SeguidosPageModule'
          },
          {
            path: 'evento-info/:eventoId/:navegacion',
            loadChildren: '../events/info/info.module#InfoPageModule'
          },
        ]
      },
      {
        path: 'publicar',
        children: [
          {
            path: '',
            loadChildren: '../publicar/publicar.module#PublicarPageModule'
          }
        ]
      },
      {
        path: 'eventos',
        children: [
          {
            path: '',
            loadChildren: '../events/eventos/eventos.module#EventosPageModule'
          },
          {
            path: 'crear-evento',
            loadChildren: '../events/crear-evento/crear-evento.module#CrearEventoPageModule'
          }
          ,
          {
            path: 'mis-eventos',
            loadChildren: '../events/mis-eventos/mis-eventos.module#MisEventosPageModule'
          },
          {
            path: 'info/:eventoId/:navegacion',
            loadChildren: '../events/info/info.module#InfoPageModule'
          },
          {
            path: 'user-info/:usuarioId/:navegacion',
            loadChildren: '../user/user-info/user-info.module#UserInfoPageModule'
          },
          {
            path: 'user-info/:usuarioId',
            loadChildren: '../user/user-info/user-info.module#UserInfoPageModule'
          },
        ]
      },
      {
        path: 'perfil',
        children: [
          {
            path: '',
            loadChildren: '../perfil/perfil.module#PerfilPageModule'
          },
          {
            path: 'evento-info/:eventoId/:navegacion',
            loadChildren: '../events/info/info.module#InfoPageModule'
          },
          {
            path: 'recipe-info/:recetaId/:navegacion',
            loadChildren: '../recipe/recipe-info/recipe-info.module#RecipeInfoPageModule'
          }, 
          {
            path: 'recipe-comments/:recetaId',
            loadChildren: '../recipe/recipe-comments/recipe-comments.module#RecipeCommentsPageModule'
          },
          {
            path: 'recipe-seguir-pasos/:recetaId',
            loadChildren: '../recipe/recipe-seguir-pasos/recipe-seguir-pasos.module#RecipeSeguirPasosPageModule'
          },
          {
            path: 'seguidores/:usuarioId',
            loadChildren: '../followers/seguidores/seguidores.module#SeguidoresPageModule'
          },
          {
            path: 'seguidos/:usuarioId',
            loadChildren: '../followers/seguidos/seguidos.module#SeguidosPageModule'
          },
          {
            path: 'user-info/:usuarioId/:navegacion',
            loadChildren: '../user/user-info/user-info.module#UserInfoPageModule'
          },

        ]
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
