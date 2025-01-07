import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: '<div class="main-body">  <router-outlet></router-outlet> <app-footer></app-footer> </div>',
  imports: [RouterOutlet, FooterComponent],
})
export class AppComponent {
}
