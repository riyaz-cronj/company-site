import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfileDataRequest } from '../models/user-profile-data-request.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private baseUrl = 'http://localhost:8080/users/edit-profile';

  constructor(private http: HttpClient) { }

  // Method to get the user profile data based on the email
  getUserProfile(email: string): Observable<UserProfileDataRequest> {
    const url = `${this.baseUrl}/${email}`;
    return this.http.get<UserProfileDataRequest>(url).pipe(
      catchError((error) => {
        console.error('Error fetching user profile data:', error);
        return throwError('Failed to fetch user profile data');
      })
    );
  }

  // Method to update user profile data
  updateUserProfile(profileData: UserProfileDataRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}`, profileData);
  }
}
