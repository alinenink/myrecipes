import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, LoaderComponent],
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = null;
  newComment: string = '';
  newRating: number = 5;
  averageRating: any;
  stars: string[] = [];
  category: string | null = null;
  originRoute: string | null = null;
  commentError: any;
  showModal = false;
  modalMessage: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id');
    this.category = this.route.snapshot.paramMap.get('category');
    this.originRoute = this.route.snapshot.queryParamMap.get('origin');

    if (recipeId) {
      this.loadRecipe(recipeId);
    }
    this.scrollToHeader()
  }

  scrollToHeader(): void {
    const headerElement = document.getElementById('header');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  loadRecipe(id: string): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (data) => {
        this.recipe = data;
        this.calculateAverageRating();
      },
      error: (err) => {
        console.error('Erro ao carregar receita:', err);
      },
    });
  }

  calculateAverageRating(): void {
    const totalRatings = this.recipe.reviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
    );

    const numberOfReviews = this.recipe.reviews.length;

    this.averageRating =
      numberOfReviews > 0 ? totalRatings / numberOfReviews : 0;

    this.stars = this.calculateStars();
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

    this.loading = false;
    return stars;
  }

  submitReview(): void {
    if (!this.newComment || this.newComment.trim().length < 10) {
      this.commentError = true;
      return;
    }

    this.commentError = false;

    const review = {
      user: 'Anonymous',
      rating: this.newRating,
      comment: this.newComment,
    };

    this.recipeService.addReview(this.recipe.id, review).subscribe({
      next: (updatedRecipe) => {
        this.recipe = updatedRecipe;
        this.loadRecipe(updatedRecipe.recipeId);

        this.newComment = '';
        this.newRating = 5;
      },
      error: (err) => {
        this.openErrorModal(err.error.error);
        console.error('Erro ao enviar avaliação:', err);
      },
    });
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star');
    }
    return stars;
  }

  goBack() {
    if (!this.category || (this.category && this.originRoute === 'profile')) {
      this.router.navigate([this.originRoute]);
    } else {
      this.router.navigate(['/details', this.category], {
        queryParams: { origin: this.originRoute },
      });
    }
  }

    // Exibe o modal de erro
    openErrorModal(message: string) {
      this.modalMessage = message;
      this.showModal = true;
    }
  
}
