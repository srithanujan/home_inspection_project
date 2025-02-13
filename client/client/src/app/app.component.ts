import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResponsiveAppBarComponent } from './core/responsive-app-bar/responsive-app-bar.component';
import { AuthGuard } from './auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ResponsiveAppBarComponent],
  providers: [AuthGuard],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'angular-structure';
}

// AuthGuard
