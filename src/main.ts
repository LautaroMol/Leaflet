import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if (!navigator.geolocation) {
  alert("el navegador no soporta el servicio de localizacion")
  throw new Error("el navegador no soporta el servicio de localizacion");
}


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
