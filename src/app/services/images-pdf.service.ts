import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* import { ImagesNewsletter } from '../interfaces/images-newsletter.interface'; */

// Imports
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesPdfService {

  constructor(private http: HttpClient) { }


  private getQuery() {
    const url = 'assets/data/images-newsletter.json';
    return this.http.get(url);
  }

  getImagesNewsletter() {
    return this.getQuery()
      .pipe(map(response => {
          return response;
      }));
  }

}
