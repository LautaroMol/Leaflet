import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';


@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  geo: any;
  map: any;
  currentLocationMarker: any;
  chosenLocationMarker: any;
  isLocated = false;
  routeControl: any;

  constructor(private placeSvc: PlacesService) {}

  Reload() {
    localStorage.removeItem('geoLoc');
    location.reload();
  }

  Locate() {
    if (this.map && this.geo && !this.isLocated) {
      import('leaflet').then(L => {
        this.geo = this.placeSvc.userLocation;
        this.currentLocationMarker = L.marker(this.geo)
          .addTo(this.map)
          .bindPopup('<b>Esta es tu ubicación actual</b>')
          .openPopup();
        this.isLocated = true;
        localStorage.setItem('geoLoc', JSON.stringify(this.geo));

        this.currentLocationMarker.on('moveend', () => {
          const latLng = this.currentLocationMarker.getLatLng();
          this.geo = [latLng.lat, latLng.lng];
          localStorage.setItem('geoLoc', JSON.stringify(this.geo));
        });

        this.map.flyTo(this.geo, 13);
      }).catch(err => console.error('Error loading Leaflet marker:', err));
    }
  }

  CalculateRoute() {
    if (this.map && this.currentLocationMarker && this.chosenLocationMarker) {
      const start = this.currentLocationMarker.getLatLng();
      const end = this.chosenLocationMarker.getLatLng();
  
      import('leaflet-routing-machine').then(() => {
        const { latLng, Routing } = (window as any).L;
  
        if (this.routeControl) {
          this.map.removeControl(this.routeControl);
        }
  
        this.routeControl = Routing.control({
          waypoints: [
            latLng(start.lat, start.lng),
            latLng(end.lat, end.lng)
          ],
          routeWhileDragging: true,
          show: false
        }).addTo(this.map);
  
        const distanceInMeters = this.map.distance(start, end);
        const distanceInKilometers = distanceInMeters / 1000;
        alert(`La distancia entre los marcadores es de ${distanceInKilometers.toFixed(2)} kilómetros.`);
      }).catch(err => console.error('Error loading Leaflet Routing Machine:', err));
    }
  }
  
  

  ngOnInit() {
    this.isLocated = false;
    document.addEventListener('userLocationReady', () => {
      this.initializeMap();
      setTimeout(() => {
        this.geo = this.placeSvc.userLocation;
        if (this.geo) {
          localStorage.setItem('geoLoc', JSON.stringify(this.geo));
        }
      }, 2000);
    });
  }

  ngAfterViewInit() {
    if (this.placeSvc.userLocation) {
      setTimeout(() => {
        this.geo = this.placeSvc.userLocation;
        if (this.geo) {
          this.initializeMap();
        }
      }, 2000);
    }
  }

  private initializeMap() {
    if (typeof window === 'undefined') {
      return; // Evita ejecutar en SSR
    }

    if (this.map) {
      return; // Evita reinicializar el mapa
    }

    this.geo = this.placeSvc.userLocation;
    if (this.geo) {
      import('leaflet').then(L => {
        this.map = L.map('map').setView(this.geo, 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (this.chosenLocationMarker) {
            this.chosenLocationMarker.setLatLng([lat, lng]);
          } else {
            this.chosenLocationMarker = L.marker([lat, lng], { draggable: true })
              .addTo(this.map)
              .bindPopup('<b>Ubicación elegida</b>')
              .openPopup();
          }
        });
      }).catch(err => console.error('Error loading Leaflet:', err));
    }
  }
}
