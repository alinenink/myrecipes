import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class RecipeFormComponent implements OnInit {
  constructor(
    private route: ActivatedRoute, // Rota ativa
    private recipeService: RecipeService, // Serviço para interagir com a API
    private router: Router
  ) {}

  isEdit: boolean = false;
  showModal = false;
  showSuccessModal = false;
  modalMessage = '';
  originRoute: string | null = null; // Para armazenar a origem da navegação
  category: string | null = null;
  recipeId: string | null = null;

  recipe = {
    id: '',
    name: '',
    category: '',
    time: 0,
    servings: 0,
    ingredients: [''],
    instructions: [''],
    image: '',
    addedBy: ''
  };

  profile: [{ name: string; bio: string; email: string; image: string }] = [
    {
      name: '',
      bio: '',
      email: '',
      image: '',
    },
  ];

  ngOnInit() {
    // Verifica se há um ID na rota para identificar "Editar"
    this.originRoute = this.route.snapshot.queryParamMap.get('origin');
    this.category = this.route.snapshot.paramMap.get('category');
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.isEdit = true;
      this.recipeService.getRecipeById(this.recipeId).subscribe({
        next: (data) => {
          this.recipe = data; // Carrega os dados da receita existente
        },
        error: (err) => {
          console.error('Erro ao carregar receita:', err);
        },
      });
    }

    this.loadProfile();
  }

  loadProfile(): void {
    this.recipeService.getProfileData().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        console.error('Erro ao carregar o perfil:', err);
      },
    });
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.recipe.image = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage() {
    this.recipe.image = '';
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  addIngredient() {
    if (this.recipe.ingredients.length < 10) {
      this.recipe.ingredients.push('');
    }
  }

  removeIngredient(index: number): void {
    if (this.recipe.ingredients.length > 1) {
      this.recipe.ingredients.splice(index, 1);
    }
  }

  addInstruction() {
    if (this.recipe.instructions.length < 10) {
      this.recipe.instructions.push('');
    }
  }

  removeInstruction(index: number): void {
    if (this.recipe.instructions.length > 1) {
      this.recipe.instructions.splice(index, 1);
    }
  }

  saveRecipe(form: NgForm) {
    // Verifica se os campos obrigatórios estão preenchidos
    if (form.invalid) {
      this.modalMessage = 'Please fill out all required fields.';
      this.showModal = true;
      return;
    }

    // Verifica limites de valores
    if (this.recipe.time < 1 || this.recipe.time > 1000) {
      this.openErrorModal(
        'Preparation time must be between 1 and 1000 minutes.'
      );
      return;
    }

    if (this.recipe.servings < 1 || this.recipe.servings > 100) {
      this.openErrorModal('Servings must be between 1 and 100.');
      return;
    }

    if (this.recipe.ingredients.some((ingredient) => ingredient.length > 10)) {
      this.openErrorModal('Each ingredient must be up to 10 characters.');
      return;
    }

    // Salva a receita (caso esteja válida)
    if (this.isEdit) {
      this.recipeService
        .updateRecipe(this.recipe.id, this.recipe)
        .subscribe(() => {
          this.openSuccessModal('Recipe updated successfully!');
        });
    } else {
      this.recipe.addedBy = this.profile[0].name;
      this.recipeService.addRecipe(this.recipe).subscribe(() => {
        this.openSuccessModal('Recipe added successfully!');
      });
    }
  }
  // Exibe o modal de erro
  openErrorModal(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  // Exibe o modal de sucesso
  openSuccessModal(message: string) {
    this.modalMessage = message;
    this.showModal = true;

    // Após fechar o modal, navega para outra tela
    setTimeout(() => {
      this.showModal = false;
      this.router.navigate(['/']);
    }, 2000);
  }

  cancelAdd() {
    // Lógica para cancelar o formulário de adição
    this.router.navigate(['/']);
  }

  goBack() {
    // Verifica a origem e navega de acordo
    if (this.originRoute && this.category) {
      this.router.navigate([this.originRoute, this.category]); // Volta para os detalhes da categoria
    } else if (this.originRoute && !this.category) {
      this.router.navigate([this.originRoute]);
    } else {
      this.router.navigate(['/']); // Caso não haja origem, vai para a principal
    }
  }
}
