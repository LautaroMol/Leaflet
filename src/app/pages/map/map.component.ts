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
    localStorage.removeItem('geoLoc')
    location.reload();
  }
  //En la funcion locate se ejemplifican algunos metodos para usar con el marcador
  Locate() {
    if (this.map && this.geo) {
      import('leaflet').then(({ marker }) => {
        this.ubi = localStorage.getItem('geoLoc');
        const miUbi = marker(JSON.parse(this.ubi),{draggable:true}).addTo(this.map).bindPopup(`<b>Esta es la ubicacion: </b> ${this.counter}`).openPopup();
        let newUbi = miUbi.setLatLng(JSON.parse(this.ubi));

        console.log(newUbi);

        miUbi.on('click',()=> console.log('Presione click'));
        
        miUbi.on('dblclick',()=> console.log('Presione doble click'));

        miUbi.on('moveend',()=>{
          let moveUbi = Object.values(newUbi);
          let meUbi = [moveUbi[1].lat,moveUbi[1].lng];

          this.ubi = meUbi;

          console.log(newUbi);
          console.log(meUbi);

          localStorage.setItem('geoLoc',JSON.stringify(this.ubi));
        });

        this.counter++;
        this.map.flyTo([miUbi.getLatLng().lat,miUbi.getLatLng().lng]);

      }).catch(err => console.error('Error loading Leaflet marker:', err));
    }
    
  }

  ngOnInit(){
    this.counter = 0;
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
