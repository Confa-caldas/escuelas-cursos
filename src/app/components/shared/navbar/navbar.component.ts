import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class NavbarComponent implements OnInit {

  public environment = environment;
 
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute
  ) { 
    }

  ngOnInit() {
  }

  logout() {
    this.utilitiesService.loading = true;
    this.utilitiesService.messageLoading = null;
    setTimeout(() => {
      this.authenticationService.logout();
      this.utilitiesService.currentUser = null;
      this.utilitiesService.nasfaUser = null;
      this.router.navigate(['/login']);
      this.utilitiesService.loading = false;
    }, 500);
  }

}
