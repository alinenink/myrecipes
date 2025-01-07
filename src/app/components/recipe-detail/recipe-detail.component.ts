import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
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

    console.log(stars);
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
        this.calculateAverageRating();
        this.newComment = '';
        this.newRating = 5;
      },
      error: (err) => {
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
    if (!this.category) {
      this.router.navigate([this.originRoute])
    }
    this.router.navigate(['/details', this.category], {
      queryParams: { origin: this.originRoute },
    });
  }
}
