import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Token } from '../interfaces/user.interface';
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
@Injectable({
	providedIn: 'root'
})
export class QuestionsService {
	constructor(private http: HttpClient, private cookieService: CookieService) {

	}
	getGenericTokenC() {
		let genericToken = {
			parametro1: environment.param1,
			parametro2: environment.param2
		};

		return this.getQueryPOST("auth", genericToken).pipe(
			map((response: Token) => {
				if (response.token) {
					this.cookieService.set("gtoken", JSON.stringify(response), 1, "/", undefined, false, "Strict");
					
				}
				return response;
			})
		);
	}
	private getQueryGET(query: string) {

		const url = `${environment.apiCircular}${query}`;
	
		let response = this.http.get(url);
		return response;
	}

	private getQueryPOST(query: string, bodyContent: any) {
		const url = `${environment.apiCircular}${query}`;
		const body = bodyContent;

		return this.http.post(url, body);
	}

	private getQueryPOSTToken(query: string, bodyContent: any) {
		const url = `${environment.apiCircular}${query}`;
		const body = bodyContent;

		return this.http.post(url, body);
	}

	getTokenGeneric() {
		let genericToken = {
			parametro1: environment.param1,
			parametro2: environment.param2
		};
		return this.getQueryPOST("auth", genericToken);
	}

	getQuestions(document: string) {
		return this.getQueryGET(`circular007/metodo2/${document}`);
	}

	getValidateResponseQuestions(respuestas: any[], document: string) {
		let body = {
			documento: document,
			respuestas: respuestas
		};
		return this.getQueryPOSTToken("circular007/metodo3", body);
	}

	getConsultInfoPerson(document: string) {
		return this.getQueryGET(`circular007/metodo4/${document}`);
	}

	getValidateTokenC(token: string) {
		let body = {
			token: token
		};
		return this.getQueryPOST("validate", body);
		
	}
}