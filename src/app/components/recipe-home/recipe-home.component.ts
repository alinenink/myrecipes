import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-recipe-home',
  templateUrl: './recipe-home.component.html',
  styleUrls: ['./recipe-home.component.scss'],
  providers: [RecipeService],
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
})
export class RecipeHomeComponent implements OnInit {
  recipes: any[] = [];

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit() {
    this.fetchRecipes();
  }

  // Obter receitas do backend
  fetchRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
      },
    });
  }

  // Excluir uma receita
  deleteRecipe(id: string) {
    if (confirm('Tem certeza de que deseja excluir esta receita?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
          this.recipes = this.recipes.filter((recipe) => recipe.id !== id); 
        },
        error: (err) => {
          console.error('Erro ao excluir receita:', err);
        },
      });
    }
  }

  goBack() {
    console.log('Voltando para a tela anterior...');
  }

  navigateTo(category: string) {
    this.router.navigate(['/details', category], { queryParams: { origin: 'home' } });
  }
}
