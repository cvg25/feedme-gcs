import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecipeSeguirPasosPage } from './recipe-seguir-pasos.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeSeguirPasosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RecipeSeguirPasosPage]
})
export class RecipeSeguirPasosPageModule {}
