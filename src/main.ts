import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Rotas fornecidas globalmente
    provideHttpClient(),   // Registra o HttpClient para uso global
  ],
}).catch((err) => console.error(err));
