import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
  standalone: true,
  imports: [CommonModule, LoaderComponent],
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];
  category: string | any;
  formattedCategory: any;
  originRoute: string | null = null;
  showModal: boolean = false;
  showModalEdit: boolean = false;
  selectedRecipeId: any;
  stars: string[] = [];
  averageRating: any;
  profile: [{ name: string; bio: string; email: string; image: string }] = [
    {
      name: '',
      bio: '',
      email: '',
      image: '',
    },
  ];
  modalMessage = '';
  loading = true;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtém a origem da navegação pelos parâmetros de consulta
    this.originRoute = this.route.snapshot.queryParamMap.get('origin');
    this.category = this.route.snapshot.paramMap.get('category');
    const convertToCamelCase = (slug: string): string => {
      return slug
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    this.formattedCategory = convertToCamelCase(this.category);
    this.loadProfile();
    this.scrollToHeader();
  }

  scrollToHeader(): void {
    const headerElement = document.getElementById('header');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            this.recipes = this.formattedCategory
              ? data.filter(
                  (recipe) =>
                    recipe.category.toLowerCase() ===
                    this.formattedCategory!.toLowerCase()
                )
              : data;

            this.recipes.forEach((recipe) => {
              recipe.isFavorite = favorites.some((fav) => fav.id === recipe.id);
              recipe.stars = this.calculateAverageRating(recipe);

              recipe.showButtons =
                this.profile[0].name.trim().toLowerCase() ===
                recipe.addedBy.trim().toLowerCase();

              this.stars = this.calculateStars();
            });

            this.recipes = this.recipes.filter((item) => !item.isApproved);
            this.loading = false;
          },
          error: (err) => console.error('Erro ao carregar favoritos:', err),
        });
      },
      error: (err) => console.error('Erro ao carregar receitas:', err),
    });
  }

  calculateAverageRating(recipe: any): void {
    const totalRatings = recipe.reviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
    );

    const numberOfReviews = recipe.reviews.length;

    this.averageRating =
      numberOfReviews > 0
        ? parseFloat((totalRatings / numberOfReviews).toFixed(1))
        : 0;

    return this.averageRating;
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
    this.showModalEdit = false;
    this.selectedRecipeId = null;
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
          this.loadRecipesWithButtons();
          console.log(`Receita ${this.selectedRecipeId} deletada com sucesso.`);
        },
        error: (err) => console.error('Erro ao excluir receita:', err),
      });
    }
  }

  editRecipe(id: string) {
    const formattedCategory = this.category.toLowerCase().replace(/\s+/g, '-');
    this.router.navigate(['/edit', id, formattedCategory], {
      queryParams: { origin: 'details' },
    });
  }

  // Exibe o modal de erro
  openErrorModal(message: string) {
    this.modalMessage = message;
    this.showModalEdit = true;
  }

  toggleFavorite(recipe: any): void {
    if (!recipe || !recipe.id) {
      console.error('Receita inválida.');
      return;
    }
  
    const currentFavoriteState = recipe.isFavorite;
    recipe.isFavorite = !currentFavoriteState;
  
    if (recipe.isFavorite) {
      this.recipeService.addToFavorites(recipe.id).subscribe({
        next: () => console.log(`${recipe.id} favoritado!`),
        error: (err) => {
          console.error(`Erro ao favoritar ${recipe.id}:`, err);
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
    const formattedCategory = this.category.toLowerCase().replace(/\s+/g, '-');
    this.router.navigate(['/recipes', formattedCategory, id], {
      queryParams: { origin: 'details' },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
