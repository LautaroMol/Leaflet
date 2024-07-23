import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  geo: any;
  map: any;
  ubi: any;
  counter = 0;

  constructor(private placeSvc: PlacesService) {}

  Reload() {
    location.reload();
  }

  Locate() {
    if (this.map && this.geo) {
      import('leaflet').then(({ marker }) => {
        marker(this.geo).addTo(this.map).bindPopup("<strong>Usted está ubicado aquí</strong>").openPopup();
      }).catch(err => console.error('Error loading Leaflet marker:', err));
    }
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('userLocationReady', () => {
        this.initializeMap();
      });
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (this.placeSvc.userLocation) {
        this.initializeMap();
      }
    }
  }

  private initializeMap() {
    if (this.map) {
      return; // Evita reinicializar el mapa
    }
    this.geo = this.placeSvc.userLocation;
    if (this.geo) {
      import('leaflet').then(L => {
        setTimeout(() => {
          this.map = new L.Map('map').setView(this.geo, 13);
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);
        }, 2000);
      }).catch(err => console.error('Error loading Leaflet:', err));
    }
  }
}
