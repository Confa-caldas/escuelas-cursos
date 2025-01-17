import { Injectable } from '@angular/core';

import { Policies, TratamientoDeDatos, CondicionesDeUsoDelServicio } from '../interfaces/policies.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {

  policies: Policies = {};
  tratamientoDeDatos: TratamientoDeDatos = {};
  condicionesDeUsoDelServicio: CondicionesDeUsoDelServicio = {};

  constructor(
    private http: HttpClient
  ) {
    this.getPolicies();
  }

  private getPolicies() {
    this.http.get("assets/data/policies.json")
      .subscribe((response: Policies) => {
        this.policies = response;
        this.tratamientoDeDatos = response.tratamientoDeDatos;
        this.condicionesDeUsoDelServicio = response.condicionesDeUsoDelServicio;
        // console.log(response);
      });
  }
}
