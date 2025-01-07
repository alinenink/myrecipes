import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  recipesCreated: number = 0;
  followers: number = 120;
  following: number = 85;
  favoritesCount: number = 0;

  achievements: any[] = [];
  displayedRecipes: any[] = [];
  allRecipes: any[] = [];
  progressPercentage: number = 0;
  profilePhoto: string | null = null;
  selectedFile: File | null = null;
  loading = true;

  profile: [{ name: string; bio: string; email: string; image: string }] = [
    {
      name: '',
      bio: '',
      email: '',
      image: '',
    },
  ];
  imageError: boolean = false;
  showModal = false;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
    this.scrollToHeader()
  }

  scrollToHeader(): void {
    const headerElement = document.getElementById('header');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngAfterViewInit() {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.scrollLeft = 50;
      setTimeout(() => (carousel.scrollLeft = 0), 1000);
    }
  }

  loadProfile(): void {
    this.recipeService.getProfileData().subscribe({
      next: (data) => {
        this.profile = data;
        this.loadRecipes(this.profile[0].name)
      },
      error: (err) => {
        console.error('Erro ao carregar o perfil:', err);
      },
    });
  }

  loadRecipes(user: string): void {
    // Obtém as receitas associadas ao usuário
    this.recipeService.getRecipesByUser(user).subscribe({
      next: (userRecipes) => {
        // Calcula a quantidade total de receitas criadas pelo usuário
        this.recipesCreated = userRecipes.length;
  
        // Lista de todas as receitas criadas pelo usuário
        this.allRecipes = userRecipes;
  
        // Limita a quantidade de receitas exibidas para 10
        this.displayedRecipes = userRecipes.slice(0, 10);
  
        // Obtém os favoritos e calcula a quantidade
        this.recipeService.getFavorites().subscribe({
          next: (favorites) => {
            this.favoritesCount = favorites.length; // Quantidade de favoritos
            this.loadAchievements(); // Atualiza as conquistas após carregar receitas e favoritos
          },
          error: (err) => {
            console.error('Erro ao carregar favoritos:', err);
          },
        });
      },
      error: (err) => {
        console.error('Erro ao carregar receitas do usuário:', err);
      },
    });
  }
  
  loadAchievements(): void {
    this.recipeService.getAchievements().subscribe((achievements) => {
      this.achievements = achievements;

      const desserts = this.allRecipes.filter(
        (recipe) => recipe.category === 'Desserts'
      );
      const mainDishes = this.allRecipes.filter(
        (recipe) => recipe.category === 'Main Dishes'
      );
      const appetizers = this.allRecipes.filter(
        (recipe) => recipe.category === 'Appetizers'
      );
      const healthyOptions = this.allRecipes.filter(
        (recipe) => recipe.category === 'Healthy Options'
      );
      const snacks = this.allRecipes.filter(
        (recipe) => recipe.category === 'Snacks'
      );
      const drinks = this.allRecipes.filter(
        (recipe) => recipe.category === 'Drinks'
      );
      const uniqueCategories = new Set(
        this.allRecipes.map((recipe) => recipe.category)
      );

      this.achievements.forEach((achievement) => {
        switch (achievement.name) {
          case 'First Recipe':
            achievement.unlocked = this.recipesCreated > 0;
            break;

          case 'Recipe Master':
            achievement.progress = this.recipesCreated;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Sweet Specialist':
            achievement.progress = desserts.length;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Dessert Fanatic':
            achievement.progress = desserts.filter(
              (recipe) => recipe.favorited
            ).length;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Dinner Expert':
            achievement.progress = mainDishes.length;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Appetizer Artist':
            achievement.progress = appetizers.length;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Healthy Choice':
            achievement.progress = healthyOptions.length;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Snack Lover':
            achievement.progress = snacks.length;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Drink Enthusiast':
            achievement.progress = drinks.length;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Explorer':
            achievement.progress = uniqueCategories.size;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;

          case 'Chef of the Year':
            achievement.progress = this.recipesCreated;
            achievement.unlocked = achievement.progress >= achievement.total;
            break;
        }

        if (achievement.unlocked && achievement.total === 1) {
          achievement.progress = 1;
        }
      });

      this.achievements.sort((a, b) => {
        return a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1;
      });

      const unlocked = this.achievements.filter((ach) => ach.unlocked).length;
      this.progressPercentage = Math.round(
        (unlocked / this.achievements.length) * 100
      );

      this.loading = false;
    });
  }

  navigateTo(destination: string): void {
    if (destination === 'recipes') {
      this.router.navigate(['/recipes']);
    } else if (destination === 'favorites') {
      this.router.navigate(['/favorites']);
    }
  }

  openEditProfileModal(): void {
    this.showModal = true;
  }

  viewAllRecipes(id: any, category: string): void {
    const formattedCategory = category
    .toLowerCase()
    .replace(/\s+/g, '-');
    this.router.navigate(['/recipes', formattedCategory, id], {
      queryParams: { origin: 'profile' },
    });
  }
}
