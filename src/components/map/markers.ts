import { } from 'googlemaps';

interface String_Marker {
    //association between venues name and markers
    [index: string]: google.maps.Marker;
}

export class Markers {
    markers: String_Marker;
    map: google.maps.Map;
    bounds: google.maps.LatLngBounds;

    constructor(map: google.maps.Map) {
        this.markers = {};
        this.map = map;
    }

    addMarker(index: string, marker: google.maps.Marker) {
        this.markers[index] = marker;
    }

    showMarker(index: string) {
        // this.hideAllMarkers();
        if (index) {
            let marker: google.maps.Marker = this.markers[index];

            for (let name in this.markers) {
                this.markers[name].setAnimation(null);
            }
            marker.setAnimation(google.maps.Animation.BOUNCE)
            marker.setMap(this.map);
            this.map.setCenter(this.markers[index].getPosition());
        }

    }

    showCurrentMarkers(indexes: string[]) {
        this.hideAllMarkers();
        for (let index of indexes) {
            this.markers[index].setMap(this.map);
            this.map.setCenter(this.markers[index].getPosition());
        }
    }

    hideAllMarkers() {
        for (const index in this.markers) {
            this.markers[index].setMap(null);
        }

        this.bounds = this.calculate_bounds();
    }

    calculate_bounds(): google.maps.LatLngBounds {
        const bounds = new google.maps.LatLngBounds();
        for (let name in this.markers) {
            if (this.markers[name].getMap()) {
                bounds.extend(this.markers[name].getPosition());
            }
        }

        return bounds;
    }
}