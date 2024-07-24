import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { marker, tileLayer } from 'leaflet';
import { json } from 'stream/consumers';

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
        this.ubi = localStorage.getItem('geoLoc');
        const miUbi = marker(JSON.parse(this.ubi)).addTo(this.map).bindPopup("<b>Esta es su ubicacion</b>").openPopup().openPopup();
      }).catch(err => console.error('Error loading Leaflet marker:', err));
    }
    
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('userLocationReady', () => {
        this.initializeMap();
        setTimeout(() => {
          if (this.ubi == null){
            this.geo = this.placeSvc.userLocation;
            localStorage.setItem('geoLoc', JSON.stringify(this.geo));

          }else{
            localStorage.removeItem('geoLoc');
            this.ubi = localStorage.getItem('geoLoc')
          }

        }, 2000);
      });
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (this.placeSvc.userLocation) {
        
        setTimeout(() => {
          this.ubi = localStorage.getItem('geoLoc');
          this.map.setView(JSON.parse('geoLoc'),13);

          this.initializeMap();
        }, 2000);
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
