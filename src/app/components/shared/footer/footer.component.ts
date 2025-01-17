import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttentionService } from '../../../services/attention.service';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class FooterComponent implements OnInit {

  constructor(
    public attentionService: AttentionService,
    public utilitiesService: UtilitiesService
  ) { }

  ngOnInit() {
  }

}
