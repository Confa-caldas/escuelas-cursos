import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class LoadingComponent implements OnInit {

  constructor(
    public utilitiesService: UtilitiesService
  ) { }

  ngOnInit() {
  }

}
