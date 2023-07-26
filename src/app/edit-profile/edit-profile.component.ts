import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { UserProfileService } from '../service/user-profile.service';
import { UserProfileDataRequest } from '../models/user-profile-data-request.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  selectedImage: string | null = null;
  selectedYear: number | null = null; // Variable to hold the selected year
  years: number[] = []; // Array to hold the list of years
  employerProfileForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userProfileService: UserProfileService, private toastr: ToastrService,
    private router: Router) {
    // Generate an array of years from the current year to 100 years ago
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
      this.years.push(year);
    }

    this.employerProfileForm = this.formBuilder.group({
      profileImage: [''],
      companyName: ['', Validators.required],
      industryType: ['', Validators.required],
      companyIdNumber: ['', Validators.required],
      websiteUrl: ['', Validators.required],
      email: ['', Validators.required],
      description: ['', Validators.required],
      companySize: ['', Validators.required],
      foundedIn: ['', Validators.required],
      location: ['', Validators.required]
    });
  }


  ngOnInit() {
    // Get the user email from session storage
    const userEmail: string = sessionStorage.getItem('email') || '';

    // Fetch the user profile data using the user email
    this.userProfileService.getUserProfile(userEmail).subscribe(
      (profileData) => {
        // Check if profileData and profileImage are not null before assigning values to the form
        if (profileData && profileData.profileImage) {

          // Convert the base64 url to a image
          const imageSource = this.dataURLtoImageSource(profileData.profileImage);

          // Populate the form with the retrieved profile data
          this.employerProfileForm.patchValue({
            // profileImage: profileData.profileImage,
            companyName: profileData.companyName,
            industryType: profileData.industryType,
            companyIdNumber: profileData.companyIdNumber,
            websiteUrl: profileData.companyWebsiteUrl,
            email: profileData.companyEmail,
            description: profileData.description,
            companySize: profileData.companySize,
            foundedIn: profileData.foundedIn,
            location: profileData.location
          });
        }
      },
      (error) => {
        console.error('Failed to fetch user profile data:', error);
      }
    );
  }



  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onPasteButtonClick() {
    // Check if the Clipboard API is available in the browser
    if (navigator.clipboard) {
      // Use the Clipboard API to read the data from the clipboard
      navigator.clipboard.readText().then((data) => {
        // `data` will contain the text data that the user has copied
        // You can now set this data to the input field or do any other action with it
        const inputElement = document.querySelector('input[placeholder="Company Website URL"]');
        if (inputElement) {
          (inputElement as HTMLInputElement).value = data;
        }
      }).catch((error) => {
        // Handle any errors that may occur during reading the clipboard
        console.error('Error reading clipboard data:', error);
      });
    } else {
      // If the Clipboard API is not available, you can use a fallback method or show a message to the user
      console.warn('Clipboard API is not available in this browser.');
    }
  }

  openYearPicker() {
    const yearInput = document.getElementById('yearInput');
    if (yearInput) {
      yearInput.focus();
    }
  }

  onFormSubmit(form: any) {
    // Handle the form submission here
    if (form.valid) {
      // Form is valid, perform the submission action

      // Convert the selected image to base64 and set it in the form data
      if (this.selectedImage) {
        // Create a new instance of UserProfileDataRequest
        // const file = this.dataURLtoFile(this.selectedImage, 'profileImage');
        const userProfileData: UserProfileDataRequest = {
          userEmail: sessionStorage.getItem('email') || '',
          profileImage: this.selectedImage,
          companyName: form.value.companyName,
          industryType: form.value.industryType,
          companyIdNumber: form.value.companyIdNumber,
          companyEmail: form.value.email,
          companyWebsiteUrl: form.value.websiteUrl,
          description: form.value.description,
          companySize: form.value.companySize,
          foundedIn: form.value.foundedIn,
          location: form.value.location
        };

        // Call the API to submit the form data
        this.userProfileService.updateUserProfile(userProfileData).subscribe(
          (response) => {
            console.log('Profile data updated successfully:', response);
            this.toastr.success('Profile data updated successfully');
            this.router.navigate(['home']);
            // Handle success, e.g., show a success message
          },
          (error) => {
            console.error('Failed to update profile data:', error);
            // Handle error, e.g., show an error message
          }
        );
      }
    } else {
      // Form is invalid, display validation errors if needed
      this.toastr.error('Please fill all the fields');
      console.log('Form is invalid!');
      // Add your code to handle invalid form submission or show validation errors
    }
  }
  // Function to convert base64 data URL to a file
  dataURLtoFile(dataURL: string, fileName: string) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  // Helper function to convert base64 data URL to an image source URL
  dataURLtoImageSource(dataURL: string) {
    return `data:image/jpeg;base64,${dataURL}`;
  }


}
