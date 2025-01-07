# Projeto Minhas Receitas

Bem-vindo ao **Minhas Receitas**, uma aplicação web full-stack projetada para oferecer uma experiência completa e envolvente para gerenciar receitas, perfis de usuário e conquistas. Este projeto demonstra desenvolvimento avançado de front-end utilizando Angular e um backend robusto construído com Node.js.

---

## **Funcionalidades**

### **Frontend (Angular)**
- **Gerenciamento de Receitas**:
  - Adicionar, editar, excluir e visualizar receitas.
  - Organizar receitas em categorias como **Sobremesas**, **Pratos Principais**, **Aperitivos**, **Opções Saudáveis**, **Lanches** e **Bebidas**.
  - Controle para evitar edição ou exclusão de receitas da vitrine.

- **Favoritos**:
  - Marcar receitas como favoritas.
  - Visualizar e gerenciar uma lista personalizada de receitas favoritas.

- **Perfil de Usuário**:
  - Fazer upload de fotos de perfil com pré-visualização ao vivo.
  - Gerenciar informações do usuário, incluindo nome, email e biografia.

- **Conquistas**:
  - Sistema dinâmico de conquistas com categorias e acompanhamento de progresso.
  - Experiência gamificada com conquistas desbloqueadas exibidas de forma destacada.

- **Design Responsivo**:
  - Otimizado para experiência mobile-first.
  - Adaptação perfeita para diferentes tamanhos de tela utilizando **CSS Grid** e **Flexbox**.

- **Carrosséis Interativos**:
  - Rolagem horizontal para conquistas e receitas.
  - Dicas visuais para usuários móveis incentivando a interação.

- **Animações**:
  - Animações suaves para botões, efeitos de hover e modais.
  - Conquistas dinamicamente animadas ao serem desbloqueadas.

### **Backend (Node.js)**
- **Gerenciamento de Dados**:
  - Operações CRUD (Criar, Ler, Atualizar, Excluir) para receitas, perfil e conquistas.
  - Arquivos JSON utilizados como um banco de dados leve e baseado em arquivos.

- **Gerenciamento de Favoritos**:
  - Adicionar e remover receitas da lista de favoritos.

- **Validações de Segurança**:
  - Controle de limite de adição e avaliações por IP.
  - Verificação do tamanho de imagens e transformação para Base64.

- **Endpoints**:
  - API RESTful para receitas, conquistas, favoritos e gerenciamento de perfis.

---

## **Tecnologias Utilizadas**

### **Frontend**
- **Angular**:
  - Última versão com componentes standalone.
  - Todos os componentes estilizados utilizando **SCSS** para um visual personalizado e coeso.

- **Estilização**:
  - **SCSS**: Estilos personalizados sem dependência de bibliotecas de UI externas.
  - **CSS Grid e Flexbox**: Usados extensivamente para design de layout.
  - **Tailwind CSS**: Aplicado para utilitários responsivos e consistência no design.

- **Ícones**:
  - **Font Awesome** para um conjunto rico de ícones.

- **Animações**:
  - Animações personalizadas usando CSS para efeitos de hover e transições.

### **Backend**
- **Node.js** com **Express**:
  - Servidor leve e eficiente para lidar com requisições API.

- **Gerenciamento de Arquivos**:
  - Receitas, favoritos e dados de perfil armazenados em arquivos JSON.
  - Operações de arquivo (leitura, escrita) gerenciadas usando módulos nativos do Node.js.

- **Middleware**:
  - **CORS** para requisições cross-origin.
  - **Body Parser** para parsing de corpos de requisições JSON.

---

## **Detalhes do Projeto**

### **Componentes do Frontend**
- **RecipeHomeComponent**: Exibe o painel principal com um resumo de receitas e conquistas.
- **RecipeListComponent**: Lista todas as receitas em uma categoria selecionada.
- **RecipeFormComponent**: Gerencia a adição e edição de receitas.
- **FavoritesComponent**: Exibe as receitas favoritas do usuário.
- **ProfileComponent**: Permite ao usuário visualizar e editar seu perfil.
- **RecipeDetailComponent**: Mostra informações detalhadas sobre uma receita específica.

Cada componente é altamente personalizado com:
- **Estilos SCSS** para um apelo visual refinado.
- Design responsivo usando **CSS Grid** e **Flexbox**.
- **Animações personalizadas** para uma experiência de usuário aprimorada.

### **Funcionalidades do Backend**
1. **Endpoints da API**:
   - `/recipes`: CRUD completo para receitas.
   - `/favorites`: Gerencia as receitas favoritas do usuário.
   - `/profile`: Visualiza e atualiza o perfil do usuário.
   - `/achievements`: Busca e atualiza o progresso das conquistas.
   - `/recipes/user/:username`: Retorna receitas de um usuário específico.

2. **Gerenciamento de Dados**:
   - Receitas incluem metadados como `addedBy`, `createdAt`, e `category`.
   - Cálculo dinâmico de conquistas baseado nos dados das receitas.
   - Campo `isApproved` adicionado para novas receitas.

3. **Tratamento de Erros**:
   - Respostas completas para operações falhas.

4. **Limitações**:
   - Limite de 3 receitas adicionadas por dia por IP.
   - Limite de 3 avaliações enviadas por dia por IP.

---

## **Design e Estética**

- **Tema Pastel Retrô**:
  - Gradientes de fundo em tons pastéis para uma aparência suave.
  - Botões estilizados com bordas inspiradas no design vintage e animações de hover.

- **Design Responsivo**:
  - Garantia de usabilidade em todos os dispositivos.

- **Interface do Usuário**:
  - Modais interativos para feedback.
  - Carrosséis com dicas de rolagem.

- **Estilização Personalizada**:
  - Estilos SCSS feitos à mão para cada componente.

---

## **Como Rodar o Projeto**

### Pré-requisitos
- Node.js instalado no sistema.
- Angular CLI instalado globalmente.

### Passos
1. Clone o repositório.
2. Navegue até a pasta do backend e execute:
   ```bash
   npm install
   node server.js
   ```
3. Navegue até a pasta do frontend e execute:
   ```bash
   npm install
   ng serve
   ```
4. Abra o navegador e acesse `http://localhost:4200`.

---

## **Implantação**

### Backend
- Deployed usando **Render**.
- Configurado para servir endpoints da API e gerenciar arquivos estáticos.

### Frontend
- Implantado usando **GitHub Pages** para hospedagem estática.

---

## **Melhorias Futuras**
- Integração com um banco de dados (e.g., MongoDB) para gerenciamento escalável de dados.
- Autenticação e segregação de dados específicos do usuário.
- Capacidades avançadas de busca e filtro para receitas.

---

Este projeto demonstra a sinergia entre ferramentas modernas de desenvolvimento web e design criativo, tornando-se uma plataforma abrangente e envolvente para gerenciar receitas.

## **Licença**

Este projeto é distribuído sob a licença MIT, permitindo sua reutilização para fins pessoais, desde que os créditos sejam mantidos.

## **Desenvolvido por**

Este projeto foi criado e desenvolvido por Aline Nink, com foco em fornecer uma experiência web sofisticada e acessível. Para conhecer mais sobre meu trabalho e explorar outros projetos, visite meu portfólio:

[Aline Nink Portfolio](https://alinenink.github.io/alinenink)


# English

# My Recipes Project

Welcome to **My Recipes**, a full-stack web application designed to provide a complete and engaging experience for managing recipes, user profiles, and achievements. This project demonstrates advanced front-end development using Angular and a robust backend built with Node.js.

---

## **Features**

### **Frontend (Angular)**
- **Recipe Management**:
  - Add, edit, delete, and view recipes.
  - Organize recipes into categories such as **Desserts**, **Main Dishes**, **Appetizers**, **Healthy Options**, **Snacks**, and **Drinks**.
  - Control to prevent editing or deleting featured recipes.

- **Favorites**:
  - Mark recipes as favorites.
  - View and manage a personalized list of favorite recipes.

- **User Profile**:
  - Upload profile pictures with live preview.
  - Manage user information, including name, email, and bio.

- **Achievements**:
  - Dynamic achievement system with categories and progress tracking.
  - Gamified experience with unlocked achievements prominently displayed.

- **Responsive Design**:
  - Optimized for a mobile-first experience.
  - Seamless adaptation to different screen sizes using **CSS Grid** and **Flexbox**.

- **Interactive Carousels**:
  - Horizontal scrolling for achievements and recipes.
  - Visual hints for mobile users to encourage interaction.

- **Animations**:
  - Smooth animations for buttons, hover effects, and modals.
  - Achievements dynamically animate when unlocked.

### **Backend (Node.js)**
- **Data Management**:
  - CRUD operations (Create, Read, Update, Delete) for recipes, profiles, and achievements.
  - JSON files used as a lightweight, file-based database.

- **Favorites Management**:
  - Add and remove recipes from the favorites list.

- **Security Validations**:
  - Limit addition and reviews by IP.
  - Validate image size and convert to Base64.

- **Endpoints**:
  - RESTful API endpoints for recipes, achievements, favorites, and profile management.

---

## **Technologies Used**

### **Frontend**
- **Angular**:
  - Latest version with standalone components.
  - All components styled using **SCSS** for a customized and cohesive look.

- **Styling**:
  - **SCSS**: Custom styles without reliance on external UI libraries.
  - **CSS Grid and Flexbox**: Extensively used for layout design.
  - **Tailwind CSS**: Applied for responsive utilities and design consistency.

- **Icons**:
  - **Font Awesome** for a rich set of icons.

- **Animations**:
  - Custom animations using CSS for hover effects and transitions.

### **Backend**
- **Node.js** with **Express**:
  - Lightweight and efficient server for handling API requests.

- **File System Management**:
  - Recipes, favorites, and profile data stored in JSON files.
  - File operations (read, write) handled using Node.js native modules.

- **Middleware**:
  - **CORS** for cross-origin requests.
  - **Body Parser** for parsing JSON request bodies.

---

## **Project Details**

### **Frontend Components**
- **RecipeHomeComponent**: Displays the main dashboard with a summary of recipes and achievements.
- **RecipeListComponent**: Lists all recipes in a selected category.
- **RecipeFormComponent**: Handles adding and editing recipes.
- **FavoritesComponent**: Displays a user’s favorite recipes.
- **ProfileComponent**: Allows the user to view and edit their profile.
- **RecipeDetailComponent**: Shows detailed information about a specific recipe.

Each component is highly customized with:
- **SCSS styles** for tailored visual appeal.
- Responsive design using **CSS Grid** and **Flexbox**.
- **Custom animations** for enhanced user experience.

### **Backend Features**
1. **API Endpoints**:
   - `/recipes`: Full CRUD for recipes.
   - `/favorites`: Manage the user's favorite recipes.
   - `/profile`: View and update the user profile.
   - `/achievements`: Fetch and update achievement progress.
   - `/recipes/user/:username`: Returns recipes by a specific user.

2. **Data Handling**:
   - Recipes include metadata such as `addedBy`, `createdAt`, and `category`.
   - Dynamic calculation of achievements based on recipe data.
   - `isApproved` field added for new recipes.

3. **Error Handling**:
   - Comprehensive error responses for failed operations.

4. **Limits**:
   - Maximum of 3 recipes added per day per IP.
   - Maximum of 3 reviews submitted per day per IP.

---

## **Design and Aesthetic**

- **Retro Pastel Theme**:
  - Background gradients in pastel tones for a soothing appearance.
  - Buttons styled with vintage-inspired borders and hover animations.

- **Responsive Design**:
  - Ensures usability across all devices.

- **User Interface**:
  - Interactive modals for feedback.
  - Carousels with scroll hints.

- **Custom Styling**:
  - Handcrafted SCSS styles for every component.

---

## **How to Run the Project**

### Prerequisites
- Node.js installed on your system.
- Angular CLI installed globally.

### Steps
1. Clone the repository.
2. Navigate to the backend folder and run:
   ```bash
   npm install
   node server.js
   ```
3. Navigate to the frontend folder and run:
   ```bash
   npm install
   ng serve
   ```
4. Open your browser and navigate to `http://localhost:4200`.

---

## **Deployment**

### Backend
- Deployed using **Render**.
- Configured to serve API endpoints and manage static files.

### Frontend
- Deployed using **GitHub Pages** for static hosting.

---

## **Future Enhancements**
- Integration with a database (e.g., MongoDB) for scalable data management.
- Authentication and user-specific data segregation.
- Advanced search and filter capabilities for recipes.

---

This project demonstrates the synergy of modern web development tools and creative design, making it a comprehensive and engaging platform for managing recipes.

---

## **License**

This project is licensed under the MIT License, permitting its reuse for personal purposes, provided proper credit is given.

---

## **Developed by**

This project was created and developed by Aline Nink, focusing on delivering a sophisticated and accessible web experience. To learn more about my work and explore other projects, visit my portfolio:

[Aline Nink Portfolio](https://alinenink.github.io/alinenink)