import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UtilitiesService } from './services/utilities.service';

import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/shared/loading/loading.component'
import { ModalContentComponent } from './components/modal-content/modal-content.component'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports:[
    RouterModule,
    LoadingComponent,
    ModalContentComponent,
    CommonModule,
  ]
    
})
export class AppComponent {
  title = 'escuelas-cursos';
  constructor(
    public utilitiesService: UtilitiesService,
    private router: Router
  ) {

  }

  
  onActivate(event: any) {
    window.scrollTo(0,0);
  }
}
