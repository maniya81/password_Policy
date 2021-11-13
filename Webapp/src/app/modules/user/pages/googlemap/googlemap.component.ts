import { Component, OnInit, ViewChild } from '@angular/core'
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.css']
})
export class GooglemapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow
  zoom = 12
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    // scrollwheel: false,
    // disableDoubleClickZoom: true,
    // maxZoom: 15,
    // minZoom: 8,
  }
  markers  = [];
  infoContent = ''
  constructor() { }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      console.log(this.center);
      
      this.markers.push({
        position: {
          lat:  position.coords.latitude,
          lng: position.coords.longitude,
        },
        label: {
          color: 'black',
          text: 'Marker label ' + (this.markers.length + 1),
        },
        title: 'Marker title ' + (this.markers.length + 1),
        info: 'Marker info 1' ,
        // options: { animation: google.maps.Animation.BOUNCE },
      },
      {
        position: {
          lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
          lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
        },
        label: {
          color: 'black',
          text: 'Marker label ' + (this.markers.length + 1),
        },
        title: 'Marker title ' + (this.markers.length + 1),
        info: 'Marker info 2',
      },
      {
        position: {
          lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
          lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
        },
        label: {
          color: 'black',
          text: 'Marker label ' + (this.markers.length + 1),
        },
        title: 'Marker title ' + (this.markers.length + 1),
        info: 'Marker info 3',
      }


      )
    })
  }
  click(event: google.maps.MouseEvent) {
    console.log(event)
  }
  openInfo(marker: MapMarker, content) {
    console.log(content);
    
    this.infoContent = content
    this.info.open(marker)
  }

}
