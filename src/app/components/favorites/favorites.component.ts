import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [CommonModule, LoaderComponent],
})
export class FavoritesComponent implements OnInit {
  recipes: any[] = [];
  favorites: any[] = [];
  stars: string[] = [];
  averageRating: number = 0;
  showModal = false;
  selectedRecipeId: any;
  category: string | null = null;
  originRoute: string | null = null;
  loading = true;

  profile: [{ name: string; bio: string; email: string; image: string }] = [
    {
      name: '',
      bio: '',
      email: '',
      image: '',
    },
  ];

  modalMessage = '';
  showModalError: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.originRoute = this.route.snapshot.queryParamMap.get('origin');
    this.category = this.route.snapshot.paramMap.get('category');
    this.loadFavorites();
    this.scrollToHeader();
  }

  scrollToHeader(): void {
    const headerElement = document.getElementById('header');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  loadFavorites(): void {
    this.recipeService.getFavorites().subscribe({
      next: (favorites: any[]) => {
        this.recipeService.getProfileData().subscribe({
          next: (profile) => {
            this.profile = profile;

            // Adiciona o atributo `showButtons` aos favoritos
            this.favorites = favorites.map((recipe) => {
              const averageRating = this.calculateAverageRating(recipe);
              const stars = this.calculateStars(averageRating);
              const showButtons =
                this.profile[0].name.trim().toLowerCase() ===
                recipe.addedBy.trim().toLowerCase();

              return {
                ...recipe,
                averageRating,
                stars,
                isFavorite: true,
                showButtons, // Adiciona `showButtons`
              };
            });

            this.loadRecipes();
          },
          error: (err) => {
            console.error('Erro ao carregar o perfil:', err);
          },
        });
      },
      error: (err) => {
        console.error('Erro ao carregar favoritos:', err);
      },
    });
  }

  editRecipe(id: string): void {
    this.router.navigate(['/edit', id], {
      queryParams: { origin: 'favorites' },
    });
  }

  confirmDelete(id: string) {
    this.selectedRecipeId = id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedRecipeId = null;
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data: any[]) => {
        this.recipes = data;
        this.stopLoading();
      },
    });
  }

  deleteRecipe() {
    if (this.selectedRecipeId) {
      const recipeToDelete = this.recipes.find(
        (recipe) => recipe.id === this.selectedRecipeId
      );

      if (recipeToDelete?.feature) {
        this.openErrorModal(
          'This recipe is part of the showcase and cannot be deleted. For assistance, contact us at alinenink@outlook.com.'
        );
        return;
      }

      this.recipeService.deleteRecipe(this.selectedRecipeId).subscribe({
        next: () => {
          // Remover da lista de favoritos
          this.recipeService
            .removeFromFavorites(this.selectedRecipeId)
            .subscribe({
              next: () => {},
              error: (err) =>
                console.error('Erro ao desfavoritar a receita:', err),
            });

          this.showModal = false;
          this.loadFavorites();
          console.log(`Receita ${this.selectedRecipeId} deletada com sucesso.`);
        },
        error: (err) => console.error('Erro ao excluir receita:', err),
      });
    }
  }

  // Exibe o modal de erro
  openErrorModal(message: string) {
    this.modalMessage = message;
    this.showModalError = true;
  }

  toggleFavorite(recipe: any): void {
    this.loading = true;
    if (!recipe || !recipe.id) {
      console.error('Invalid recipe object.');
      return;
    }

    const previousState = recipe.isFavorite;
    recipe.isFavorite = !recipe.isFavorite;

    if (recipe.isFavorite) {
      // Remove o campo `image` do objeto antes de enviar
      const { image, ...recipeWithoutImage } = recipe;

      this.recipeService.addToFavorites(recipeWithoutImage).subscribe({
        next: () => {
          console.log(`${recipe.name} favoritada!`);
          this.stopLoading();
        },
        error: (err) => {
          console.error(`Erro ao favoritar ${recipe.name}:`, err);
          recipe.isFavorite = previousState;
          this.stopLoading();
        },
      });
    } else {
      this.recipeService.removeFromFavorites(recipe.id).subscribe({
        next: () => {
          console.log(`${recipe.name} desfavoritada!`);
          this.loadFavorites(); // Atualiza a lista de favoritos
          this.stopLoading();
        },
        error: (err) => {
          console.error(`Erro ao desfavoritar ${recipe.name}:`, err);
          recipe.isFavorite = previousState;
          this.stopLoading();
        },
      });
    }
  }

  stopLoading() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  calculateAverageRating(recipe: any): number {
    if (!recipe.reviews || recipe.reviews.length === 0) {
      return 0;
    }

    const totalRatings = recipe.reviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
    );

    return parseFloat((totalRatings / recipe.reviews.length).toFixed(1));
  }

  calculateStars(averageRating: number): string[] {
    const stars = [];
    let rating = averageRating;

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

    return stars;
  }

  viewDetails(category: string, id: string): void {
    this.router.navigate(['/recipes', category, id], {
      queryParams: { origin: 'favorites' },
    });
  }
}
