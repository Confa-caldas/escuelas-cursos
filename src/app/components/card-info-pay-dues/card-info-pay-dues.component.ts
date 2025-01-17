import { Component, OnInit } from "@angular/core";
import { UtilitiesService } from "../../services/utilities.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-card-info-pay-dues",
  templateUrl: "./card-info-pay-dues.component.html",
  styleUrls: ["./card-info-pay-dues.component.css"],
  standalone: true,
  imports:[
    CommonModule
  ]
})
export class CardInfoPayDuesComponent implements OnInit {
  constructor(public utilitiesService: UtilitiesService) {}

  ngOnInit(): void {}
}
