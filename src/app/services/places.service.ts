import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  
  public userLocation?: [number, number];

  constructor() {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      this.getUserLocation();
    } else {
      console.error('Geolocation is not supported by your environment');
    }
  }

  public getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.userLocation = [coords.latitude, coords.longitude];
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }
}
