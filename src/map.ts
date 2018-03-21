import { } from 'googlemaps';

let map: google.maps.Map;

export function initMap(div: HTMLElement): google.maps.Map {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15
    });
    map.data.loadGeoJson('data/lakes.geojson');
    map.data.setStyle({
        fillColor: 'green'
    });

    return map;
}

