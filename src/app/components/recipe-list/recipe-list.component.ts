import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];
  category: string | null = null;
  originRoute: string | null = null;
  showModal: boolean = false;
  selectedRecipeId: string | null = null;
  stars: string[] = [];
  averageRating: number = 0;
  profile: [{ name: string; bio: string; email: string; image: string }] = [
    {
      name: '',
      bio: '',
      email: '',
      image: '',
    },
  ];

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtém a origem da navegação pelos parâmetros de consulta
    this.originRoute = this.route.snapshot.queryParamMap.get('origin');
    this.category = this.route.snapshot.paramMap.get('category');
    this.loadProfile();
  }

  loadProfile(): void {
    this.recipeService.getProfileData().subscribe({
      next: (data) => {
        this.profile = data;
        this.loadRecipesWithButtons();
      },
      error: (err) => {
        console.error('Erro ao carregar o perfil:', err);
      },
    });
  }

  loadRecipesWithButtons(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data: any[]) => {
        this.recipeService.getFavorites().subscribe({
          next: (favorites: any[]) => {
            this.recipes = this.category
              ? data.filter(
                  (recipe) =>
                    recipe.category.toLowerCase() ===
                    this.category!.toLowerCase()
                )
              : data;

            this.recipes.forEach((recipe) => {
              recipe.isFavorite = favorites.some((fav) => fav.id === recipe.id); 
              recipe.stars = this.calculateAverageRating(recipe);

              recipe.showButtons =
                this.profile[0].name.trim().toLowerCase() ===
                recipe.addedBy.trim().toLowerCase();
            });
          },
          error: (err) => console.error('Erro ao carregar favoritos:', err),
        });
      },
      error: (err) => console.error('Erro ao carregar receitas:', err),
    });
  }

  calculateAverageRating(recipe: any): void {
    if (recipe && recipe.reviews.length > 0) {
      const totalRatings = recipe.reviews.reduce(
        (sum: number, review: any) => sum + review.rating,
        0
      );

      const numberOfReviews = recipe.reviews.length;

      this.averageRating =
        numberOfReviews > 0 ? totalRatings / numberOfReviews : 0;

      this.stars = this.calculateStars();
    }
  }

  calculateStars(): string[] {
    const stars = [];
    let rating = this.averageRating;

    for (let i = 1; i <= 5; i++) {
      if (rating >= 1) {
        stars.push('full'); // Estrela cheia
      } else if (rating > 0) {
        stars.push('half'); // Meia estrela
      } else {
        stars.push('empty'); // Estrela vazia
      }
      rating -= 1;
    }

    console.log(stars);
    return stars;
  }

  confirmDelete(id: string) {
    this.selectedRecipeId = id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedRecipeId = null;
  }

  deleteRecipe() {
    if (this.selectedRecipeId) {
      this.recipeService.deleteRecipe(this.selectedRecipeId).subscribe({
        next: () => {
          this.showModal = false;
          this.loadRecipesWithButtons();
        },
        error: (err) => console.error('Erro ao excluir receita:', err),
      });
    }
  }

  editRecipe(id: string) {
    this.router.navigate(['/edit', id, this.category], {
      queryParams: { origin: 'details' },
    });
  }

  toggleFavorite(recipe: any): void {
    if (!recipe || !recipe.id) {
      console.error('Receita inválida.');
      return;
    }

    const currentFavoriteState = recipe.isFavorite;
    recipe.isFavorite = !currentFavoriteState;

    if (recipe.isFavorite) {
      this.recipeService.getRecipeById(recipe.id).subscribe({
        next: (fullRecipe) => {
          console.log(fullRecipe);
          this.recipeService.addToFavorites(fullRecipe).subscribe({
            next: () => console.log(`${fullRecipe.name} favoritado!`),
            error: (err) => {
              console.error(`Erro ao favoritar ${fullRecipe.name}:`, err);
              recipe.isFavorite = currentFavoriteState;
            },
          });
        },
        error: (err) => {
          console.error(`Erro ao buscar receita completa:`, err);
          recipe.isFavorite = currentFavoriteState;
        },
      });
    } else {
      this.recipeService.removeFromFavorites(recipe.id).subscribe({
        next: () => console.log(`${recipe.name} desfavoritado!`),
        error: (err) => {
          console.error(`Erro ao desfavoritar ${recipe.name}:`, err);
          recipe.isFavorite = currentFavoriteState;
        },
      });
    }
  }

  viewDetails(id: string): void {
    this.router.navigate(['/recipes', this.category, id], {
      queryParams: { origin: 'details' },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
