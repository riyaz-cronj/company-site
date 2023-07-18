import { Component } from '@angular/core';
import { HomeService } from '../service/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private homeService: HomeService, private router: Router) {

  }

  testingJwt() {
    this.homeService.GetAll().subscribe(
      result => {
        console.log('API response:', result);
      },
      error => {
        console.error('API error:', error); // Log any error that occurred
      }
    );
  }


  // testingJwtWelcome() {
  //   this.homeService.GetWelcome().subscribe(result => {
  //     console.log(result); // Log the result from the API call
  //   },
  //     error => {
  //       console.error(error); // Log any error that occurred
  //     });

  // }
}
