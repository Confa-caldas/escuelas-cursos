import { Component, OnInit } from '@angular/core';

import {ModalPoliciesComponent} from '../modal-policies/modal-policies.component';
import {ModalLoginComponent} from '../modal-login/modal-login.component';
import {ModalMessagesComponent} from '../modal-messages/modal-messages.component';
import {ModalPayComponent} from '../modal-pay/modal-pay.component';


@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css'],
  standalone: true,
  imports:[
    ModalPoliciesComponent,
    ModalLoginComponent,
    ModalMessagesComponent,
    ModalPayComponent
  ]
})
export class ModalContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
