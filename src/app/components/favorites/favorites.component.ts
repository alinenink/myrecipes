import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  stars: string[] = [];
  averageRating: number = 0;
  category: string | null = null;
  originRoute: string | null = null;
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

  ngOnInit(): void {
    this.originRoute = this.route.snapshot.queryParamMap.get('origin');
    this.category = this.route.snapshot.paramMap.get('category');
    this.loadFavorites();
    this.scrollToTop();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  confirmDelete(id: string): void {}

  toggleFavorite(recipe: any) {
    if (!recipe || !recipe.id) {
      console.error('Invalid recipe object.');
      return;
    }

    const previousState = recipe.isFavorite;
    recipe.isFavorite = !recipe.isFavorite;

    if (recipe.isFavorite) {
      this.recipeService.addToFavorites(recipe).subscribe({
        next: () => {
          console.log(`${recipe.name} favorited!`);
        },
        error: (err) => {
          console.error(`Error favoriting ${recipe.name}:`, err);
          recipe.isFavorite = previousState;
        },
      });
    } else {
      this.recipeService.removeFromFavorites(recipe.id).subscribe({
        next: () => {
          console.log(`${recipe.name} unfavorited!`);
          this.loadFavorites();
        },
        error: (err) => {
          console.error(`Error unfavoriting ${recipe.name}:`, err);
          recipe.isFavorite = previousState;
        },
      });
    }
  }

  calculateAverageRating(recipe: any): number {
    if (!recipe.reviews || recipe.reviews.length === 0) {
      return 0;
    }

    const totalRatings = recipe.reviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
    );
    return totalRatings / recipe.reviews.length;
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

  viewDetails(id: string): void {
    this.router.navigate(['/recipes', id], {
      queryParams: { origin: 'favorites' },
    });
  }
}
