import { Routes } from '@angular/router';
import { RecipeHomeComponent } from './components/recipe-home/recipe-home.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  { path: '', component: RecipeHomeComponent }, 
  { path: 'add', component: RecipeFormComponent }, 
  { path: 'edit/:id/:category', component: RecipeFormComponent }, 
  { path: 'edit/:id', component: RecipeFormComponent }, 
  { path: 'details/:category', component: RecipeListComponent }, 
  { path: 'favorites', component: FavoritesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'recipes/:category/:id', component: RecipeDetailComponent },
  { path: '**', redirectTo: '' }, // Redireciona para a página inicial em rotas inválidas
];
