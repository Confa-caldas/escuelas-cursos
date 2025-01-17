import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';

import { NavbarComponent } from '../navbar/navbar.component'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports:[NavbarComponent]
})
export class HeaderComponent implements OnInit {

  public environment = environment;

  constructor() {
  }

  ngOnInit() {
  }

}
