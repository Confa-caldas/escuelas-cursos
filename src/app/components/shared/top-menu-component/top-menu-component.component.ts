import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu-component',
  standalone: true,
  imports: [],
  templateUrl: './top-menu-component.component.html',
  styleUrl: './top-menu-component.component.css'
})
export class TopMenuComponentComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    const currentUrl = this.router.url;
  
    // Activa "Cursos" solo si está en '/asistente' o '/resumen'
    if (route === '/cursos' && (currentUrl === '/asistente' || currentUrl === '/resumen')) {
      return true;
    }
  
    // Activa "Seleccion asistentes" solo si está en '/asistente' o '/resumen'
    if (route === '/asistente' && (currentUrl === '/asistente' || currentUrl === '/resumen')) {
      return true;
    }
  
    // Activa "Resumen" solo si está en '/resumen'
    if (route === '/resumen' && currentUrl === '/resumen') {
      return true;
    }
  
    // Por defecto, no activa ningún otro elemento
    return false;
  }
  
  

}
