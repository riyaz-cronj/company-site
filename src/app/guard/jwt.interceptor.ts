import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwtToken = sessionStorage.getItem("jwtToken");
        if (jwtToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    // Unauthorized error (invalid or expired token)
                    // Redirect to the login page
                    this.router.navigate(['']);
                }
                throw error;
            })
        );
    }
}
