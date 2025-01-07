import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // local
  private apiUrl = 'http://localhost:3000/recipes';
  private apiUrlFav = 'http://localhost:3000/favorites';
  private apiUrlProfile = 'http://localhost:3000/profile';
  private apiUrlAchivie = 'http://localhost:3000';

  //private apiUrl = 'https://myrecipes-x9jv.onrender.com/recipes';
  //private apiUrlFav = 'https://myrecipes-x9jv.onrender.com/favorites';
  //private apiUrlProfile = 'https://myrecipes-x9jv.onrender.com/profile';
  //private apiUrlAchivie = 'https://myrecipes-x9jv.onrender.com';

  constructor(private http: HttpClient) {}

  /**
   * Obtém os dados do perfil.
   * @returns Observable com os dados do perfil.
   */
  getProfileData(): Observable<any> {
    return this.http.get(`${this.apiUrlProfile}`);
  }

  /**
   * Atualiza os dados do perfil no backend.
   * @param profileData Objeto contendo os dados do perfil.
   * @returns Observable com a resposta do backend.
   */
  updateProfileData(profileData: {
    nome: string;
    email: string;
    bio: string;
    image: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrlProfile}`, profileData);
  }
  /**
   * Obtém todas as receitas associadas a um usuário específico.
   * @param username Nome do usuário.
   * @returns Observable com a lista de receitas do usuário.
   */
  getRecipesByUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${username}`);
  }

  /**
   * Obtém a lista completa de receitas.
   * @returns Observable com todas as receitas disponíveis.
   */
  getRecipes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtém os detalhes de uma receita específica pelo ID.
   * @param id ID da receita.
   * @returns Observable com os detalhes da receita.
   */
  getRecipeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Adiciona uma nova receita ao backend.
   * @param recipe Objeto contendo os dados da receita.
   * @returns Observable com a resposta do backend.
   */
  addRecipe(recipe: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, recipe);
  }

  /**
   * Atualiza os dados de uma receita existente.
   * @param id ID da receita.
   * @param recipe Objeto contendo os dados atualizados.
   * @returns Observable com a resposta do backend.
   */
  updateRecipe(id: string, recipe: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, recipe);
  }

  /**
   * Exclui uma receita específica pelo ID.
   * @param id ID da receita.
   * @returns Observable<void> com o status da exclusão.
   */
  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Adiciona uma receita aos favoritos.
   * @param recipe Objeto contendo os dados da receita favorita.
   * @returns Observable com a resposta do backend.
   */
  addToFavorites(recipe: any): Observable<any> {
    return this.http.post<any>(this.apiUrlFav, recipe);
  }

  /**
   * Remove uma receita dos favoritos pelo ID.
   * @param recipeId ID da receita favorita.
   * @returns Observable<void> com o status da remoção.
   */
  removeFromFavorites(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlFav}/${recipeId}`);
  }

  /**
   * Obtém a lista de receitas favoritas do usuário.
   * @returns Observable com todas as receitas favoritas.
   */
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlFav);
  }

  /**
   * Adiciona uma avaliação a uma receita específica.
   * @param recipeId ID da receita a ser avaliada.
   * @param review Objeto contendo os dados da avaliação.
   * @returns Observable com a resposta do backend.
   */
  addReview(
    recipeId: string,
    review: { user: string; rating: number; comment: string }
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${recipeId}/reviews`, review);
  }

  /**
   * Obtém a lista de achiviements.
   * @returns Observable com todos os achiviements.
   */
  getAchievements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlAchivie}/achievements`);
  }
}
