import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) {

  }
  private apiUrl = 'http://localhost:8080/home';

  GetAll() {
    return this.http.get(this.apiUrl);
  }

  // GetWelcome() {
  //   return this.http.get(`${this.apiUrl}/welcome`);
  // }
}
