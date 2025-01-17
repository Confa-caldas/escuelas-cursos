import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-pay-dues-form',
  templateUrl: './card-pay-dues-form.component.html',
  styleUrls: ['./card-pay-dues-form.component.css'],
  standalone:true,
  imports:[
    CommonModule
  ]
})
export class CardPayDuesFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
