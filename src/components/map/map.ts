import { } from 'googlemaps';
import { Markers } from './markers';
import * as $ from 'jquery';
import { Venue } from '../../Venue'
import { observable, computed, applyBindings, observableArray, components } from 'knockout';
import { registerGoogleMaps } from '../../gmap';
import * as style from './map.css';

export class MapComponent {
    map: google.maps.Map;
    markers: Markers;
    constructor(element: HTMLElement, params: any) {
        const loadGoogleMaps = registerGoogleMaps();
        loadGoogleMaps.then(() => {
            this.map = new google.maps.Map(element, params.options);
            this.map.data.loadGeoJson('data/lakes.geojson');
            this.map.data.setStyle({
                fillColor: 'green'
            });

            this.markers = new Markers(this.map);

            const venues: Venue[] = params.venues();
            for (const venue of venues) {
                this.addVenueMarker(venue.name, venue.location, venue.href);
            }

            //add the hooks to update the map - these are not managed by Knockout
            params.visibleVenues.subscribe((venues: Venue[]) => {
                this.markers.showCurrentMarkers(venues.map(v => v.name));
                this.map.fitBounds(this.markers.calculate_bounds());
            });
            params.currentVenue.subscribe((venue: Venue) => {
                this.markers.showMarker(venue.name)
            });
        });
    }

    addVenueMarker(name: string, location: google.maps.LatLng, href: string): google.maps.Marker {
        const marker = new google.maps.Marker({
            map: this.map,
            position: location,
            title: name,
            animation: google.maps.Animation.DROP,
        });

        marker.addListener('click', () => {
            const infowindow = new google.maps.InfoWindow({
                content: `<div><a href="${href}">${name}</a></div>`
            });
            infowindow.open(this.map, marker);
        });

        this.markers.addMarker(name, marker);
        this.map.fitBounds(this.markers.calculate_bounds());
        return marker;
    }
}

export const viewmodel = {
    viewModel: {
        createViewModel: function (params: any, componentInfo: any) {
            return new MapComponent($(componentInfo.element).find('#map').get(0), params);
        }
    },
    template: `<div class="${style.map}" id="map"></div>`
};

components.register('map-widget', viewmodel);