const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// File paths
const filePath = "./recipes.json";
const favoritesFilePath = "./favorites.json";
const profilePath = "./profile.json";
const achievementsFilePath = "./achievements.json";

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Utility functions
const ensureFileExists = (filePath, defaultContent) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2), "utf8");
  }
};

const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, err);
    return [];
  }
};

const writeFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`Erro ao escrever no arquivo ${filePath}:`, err);
  }
};

// Ensure necessary files exist
ensureFileExists(filePath, []);
ensureFileExists(favoritesFilePath, []);
ensureFileExists(profilePath, { photo: null });

// Limite de 3 avaliações e receitas por dia por IP
const recipeLimiter  = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 3, // Máximo de 3 requisições
  message: {
    error: 'You have reached the daily limit for reviews. Please try again tomorrow.',
  },
  standardHeaders: true, // Retorna informações no header `RateLimit-*`
  legacyHeaders: false, // Desativa cabeçalhos `X-RateLimit-*`
});

// Profile Endpoints
/**
 * GET /profile
 * Retrieve profile data
 */
app.get("/profile", (req, res) => {
  try {
    const profileData = JSON.parse(fs.readFileSync(profilePath, "utf8"));
    res.json(profileData);
  } catch (err) {
    console.error("Erro ao ler o perfil:", err);
    res.status(500).json({ error: "Erro ao obter os dados do perfil" });
  }
});

/**
 * POST /profile
 */
app.post("/profile", (req, res) => {
  const { nome, email, bio, image } = req.body;
  if (!nome || !email || !bio || !image) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const profileData = { nome, email, bio, image };
  fs.writeFile(profilePath, JSON.stringify(profileData, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar o perfil:", err);
      res.status(500).json({ error: "Erro ao salvar o perfil" });
    } else {
      res.json({ success: true, data: profileData });
    }
  });
});

// Recipe Endpoints
/**
 * GET /recipes
 * Retrieve all recipes
 */
app.get("/recipes", (req, res) => {
  res.json(readFile(filePath));
});

/**
 * GET /recipes/:id
 * Retrieve a specific recipe by ID
 */
app.get("/recipes/:id", (req, res) => {
  const recipes = readFile(filePath);
  const recipe = recipes.find((r) => r.id === req.params.id);
  recipe
    ? res.json(recipe)
    : res.status(404).json({ error: "Recipe not found" });
});

/**
 * POST /recipes
 * Add a new recipe
 */
app.post("/recipes", recipeLimiter, (req, res) => {
  const {
    name,
    category,
    time,
    servings,
    ingredients,
    instructions,
    image,
    addedBy,
    email,
    isApproved,
  } = req.body;

  // Verificação de campos obrigatórios
  if (
    !name ||
    !category ||
    !time ||
    !servings ||
    !ingredients ||
    !instructions ||
    !addedBy ||
    !email
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const recipes = readFile(filePath);

  // Nova receita
  const newRecipe = {
    id: `${Date.now()}`,
    name,
    category,
    time,
    servings,
    ingredients,
    instructions,
    image: image || "",
    addedBy,
    email,
    isApproved: isApproved || false, // Padrão como false
    reviews: [],
  };

  // Adiciona a nova receita ao arquivo
  recipes.push(newRecipe);
  writeFile(filePath, recipes);

  res.status(201).json({ success: true, data: newRecipe });
});

// PUT /recipes/:id
app.put('/recipes/:id', (req, res) => {
  const { id } = req.params; // ID da receita
  const updatedRecipe = req.body; // Novo objeto de receita enviado pelo cliente

  // Lê o arquivo de receitas
  const recipes = readFile(filePath);

  // Encontra o índice da receita com o ID correspondente
  const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);

  if (recipeIndex === -1) {
    // Caso a receita não seja encontrada
    return res.status(404).json({ error: 'Recipe not found' });
  }

  // Substitui o objeto existente pelo novo
  recipes[recipeIndex] = { ...recipes[recipeIndex], ...updatedRecipe };

  // Salva as alterações no arquivo JSON
  writeFile(filePath, recipes);

  // Retorna a receita atualizada como resposta
  res.status(200).json({ success: true, data: recipes[recipeIndex] });
});


/**
 * DELETE /recipes/:id
 * Delete a recipe by ID
 */
app.delete("/recipes/:id", (req, res) => {
  const recipes = readFile(filePath);
  const updatedRecipes = recipes.filter((r) => r.id !== req.params.id);
  if (recipes.length === updatedRecipes.length) {
    return res.status(404).json({ error: "Recipe not found" });
  }
  writeFile(filePath, updatedRecipes);
  res.status(204).send();
});


/**
 * POST /recipes/:recipeId/reviews
 * Add a review to a specific recipe
 * Returns the recipe ID after adding the review
 */
app.post("/recipes/:recipeId/reviews", recipeLimiter , (req, res) => {
  const { recipeId } = req.params;
  const { user, rating, comment } = req.body;

  if (!user || !rating || !comment) {
    return res.status(400).json({ error: "All fields (user, rating, comment) are required." });
  }

  const recipes = readFile(filePath);
  const recipe = recipes.find((r) => r.id === recipeId);

  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found." });
  }

  if (!recipe.reviews) {
    recipe.reviews = [];
  }

  const newReview = { user, rating, comment, createdAt: new Date().toISOString() };
  recipe.reviews.push(newReview);

  writeFile(filePath, recipes);

  res.status(201).json({ recipeId: recipe.id });
});

// Endpoint para obter todas as receitas de um usuário específico
app.get('/recipes/user/:username', (req, res) => {
  const { username } = req.params;

  try {
    const recipes = readFile(filePath); // Lê todas as receitas do arquivo JSON
    const userRecipes = recipes.filter((recipe) => recipe.addedBy === username);

    res.status(200).json(userRecipes); // Retorna as receitas do usuário
  } catch (err) {
    console.error('Erro ao obter receitas por usuário:', err);
    res.status(500).json({ error: 'Erro ao obter receitas por usuário' });
  }
});


// Favorites Endpoints
/**
 * GET /favorites
 * Retrieve all favorite recipes
 */
app.get("/favorites", (req, res) => {
  res.json(readFile(favoritesFilePath));
});

/**
 * POST /favorites
 * Add a recipe to favorites
 */
app.post("/favorites", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "ID da receita é obrigatório" });
  }

  const recipes = readFile(filePath);
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) {
    return res.status(404).json({ error: "Receita não encontrada" });
  }

  const favorites = readFile(favoritesFilePath);
  if (favorites.some((fav) => fav.id === id)) {
    return res.status(400).json({ error: "Receita já está nos favoritos" });
  }

  favorites.push(recipe);
  writeFile(favoritesFilePath, favorites);
  res.status(201).json({ success: true, data: recipe });
});

/**
 * DELETE /favorites/:id
 * Remove a recipe from favorites
 */
app.delete("/favorites/:id", (req, res) => {
  const favorites = readFile(favoritesFilePath);
  const updatedFavorites = favorites.filter((fav) => fav.id !== req.params.id);
  if (favorites.length === updatedFavorites.length) {
    return res.status(404).json({ error: "Favorito não encontrado" });
  }
  writeFile(favoritesFilePath, updatedFavorites);
  res.status(200).json({ message: "Favorito removido com sucesso" });
});

// Endpoint para obter todas as conquistas
app.get("/achievements", (req, res) => {
  try {
    const achievements = readFile(achievementsFilePath);
    res.json(achievements);
  } catch (err) {
    console.error("Erro ao ler as conquistas:", err);
    res.status(500).json({ error: "Erro ao obter as conquistas" });
  }
});

// Endpoint para obter uma conquista específica por nome
app.get("/achievements/:name", (req, res) => {
  const achievements = readFile(achievementsFilePath);
  const achievement = achievements.find(
    (ach) => ach.name.toLowerCase() === req.params.name.toLowerCase()
  );
  if (achievement) {
    res.json(achievement);
  } else {
    res.status(404).json({ error: "Conquista não encontrada" });
  }
});

// Start server

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
