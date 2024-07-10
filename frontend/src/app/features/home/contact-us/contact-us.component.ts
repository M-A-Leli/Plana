import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contact = {
    name: '',
    email: '',
    message: ''
  };
  mapAvailable = false; // Set to true if you want to include a map

  constructor() {}

  ngOnInit(): void {
    // Initialize the map if mapAvailable is true
    if (this.mapAvailable) {
      this.initMap();
    }
  }

  onSubmit(): void {
    // Handle form submission
    console.log('Contact form submitted', this.contact);
    // Add form submission logic here
  }

  initMap(): void {
    // Initialize map logic here if you want to include a map
    // Example: using Google Maps JavaScript API
    // const mapElement = document.getElementById('map');
    // if (mapElement) {
    //   new google.maps.Map(mapElement, {
    //     center: { lat: -34.397, lng: 150.644 },
    //     zoom: 8
    //   });
    // }
  }
}
