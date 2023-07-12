import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static isLoggedIn() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {

  }

  apiUrl = ' http://localhost:8080/users'
  GetAll() {
    return this.http.get(this.apiUrl);
  }

  GetUserbyCode(email: any) {
    return this.http.get(`${this.apiUrl}?email=${email}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    const url = `${this.apiUrl}/email/${email}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        return response != null; // Return true if the response is not null
      }),
      catchError(error => {
        console.error('Email check failed', error);
        return of(false);
      })
    );
  }



  proceedRegister(inputData: any, role: string): Observable<any> {
    const { email, password } = inputData;
    const userData = { email, password, role: role };

    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError((error) => {
        if (error.status === 409 && error.error === 'Email already exists') {
          return throwError({ success: false, message: 'Email already exists' });
        } else {
          return throwError({ success: false, message: 'Registration Failed' });
        }
      })
    );
  }



  proceedLogin(email: string, password: string, role: string): Observable<any> {
    const loginData = { email, password, role };
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      catchError((error) => {
        console.error('Login failed', error);
        return of(null); // Return null if login fails
      })
    );
  }





  IsLoggedIn() {
    return sessionStorage.getItem('email') != null;
  }

  GetUserRole() {
    return sessionStorage.getItem('role') != null ? sessionStorage.getItem('role')?.toString() : '';
  }
}
