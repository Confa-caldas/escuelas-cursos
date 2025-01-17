import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//interfaces
import { Pago } from "../../interfaces/cursos.interface";

//servicios
import { PoliciesService } from '../../services/policies.service';
import { UtilitiesService } from "../../services/utilities.service";
declare var $: any;

@Component({
  selector: 'app-modal-policies',
  templateUrl: './modal-policies.component.html',
  styleUrls: ['./modal-policies.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class ModalPoliciesComponent implements OnInit {
  public responsable = false;
  vapago = false;
  nombre = "";
  documento = "";
  public alert_name1 = "";
  public alert_doc = "";
  public alertMessage = "";
  public validate = false;
  constructor(
    public policiesService: PoliciesService,
    public utilitiesService: UtilitiesService
  ) {
    this.inicio();
  }

  ngOnInit() {
    this.esMenosr();
  }

  inicio() {
    let pago: Pago = {
      vapago: false,
      esmenor: false,
      nombreres: "",
      documentores: "",
    };
    localStorage.setItem("pago", JSON.stringify(pago));
  }

  esMenosr() {
    let user: Pago = JSON.parse(localStorage.getItem("pago"));
    if (user.esmenor == true) {
      this.responsable = true;
      this.vapago = user.vapago;
    } else {
      this.responsable = false;
      this.vapago = user.vapago;
    }
  }
  pagar2() {
    this.utilitiesService.loading = true;
    $(".btn-modal-polices").click();
    setTimeout(() => {
      this.utilitiesService.loading = false;
      $(".btn_reserve").click();
    }, 1000);
  }
  pagar3() {
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.utilitiesService.loading = false;
      $(".btn-modal-polices").click();
    }, 1000);
  }
}
