module.exports = {
  darkMode: 'class', // Ativa o modo escuro baseado na classe 'dark'
  content: [
    "./src/**/*.{html,ts,scss}", // Certifique-se de incluir todos os arquivos do Angular
  ],
  theme: {
    extend: {
      colors: {
        pastel: '#fef8e7', // Adiciona a cor pastel
        darkBackground: '#1e1e2f', // Fundo para modo escuro
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out', // Animação de entrada
      },
    },
  },
  plugins: [],
};
