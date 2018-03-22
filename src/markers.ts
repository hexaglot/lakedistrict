import { } from 'googlemaps';
import { Venue } from './Venue';

export class Markers {
    markers: google.maps.Marker[];
    map: google.maps.Map;

    constructor(map : google.maps.Map) {
        this.markers = [];
        this.map = map;
    }

    addMarker(marker : google.maps.Marker) {
        this.markers.push(marker);
    }
    
    showCurrentMarker(venue: Venue) {
        //hide all markers
        for (const marker of this.markers) {
            marker.setMap(null);

            if (marker.getTitle() === venue.name) {
                marker.setMap(this.map);
                this.map.setCenter(marker.getPosition());
            }
        }
    }

    hideAllMarkers() {
        for (const marker of this.markers) {
            marker.setMap(null);
        }
    }

    showVisibleMarkers(term: string) {
        //remove anything which doesn't match the string
        const regex = new RegExp(term);

        // const matchingVenues = this.allVenues.filter((v: Venue) => regex.test(v.name));
        const matchingMarkers = this.markers.filter((m: google.maps.Marker) => regex.test(m.getTitle()));

        this.hideAllMarkers();
        if (matchingMarkers.length !== 0) {
            const bounds = new google.maps.LatLngBounds();
            for (const marker of matchingMarkers) {
                marker.setMap(this.map);
                bounds.extend(marker.getPosition());
            }
            if (this.map) {
                this.map.fitBounds(bounds);
            }
        }
    }
}