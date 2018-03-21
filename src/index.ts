import { } from 'googlemaps';
import * as style from './styles.css';
import * as $ from 'jquery';
import { registerGoogleMaps } from './gmap';
import { initMap } from './map';
import { Venue, ViewModel } from './venueViewModel';
import { applyBindings } from 'knockout';

// let venues: Venue[];
let markers: google.maps.Marker[] = [];
let t = style.test;
let map: google.maps.Map;

const vm = new ViewModel()

function showCurrentMarker(venue: Venue) {
    //hide all markers
    for (const marker of markers) {
        marker.setMap(null);

        if (marker.getTitle() === venue.name) {
            marker.setMap(map);
            map.setCenter(marker.getPosition());
        }
    }
}

function hideAllMarkers() {
    for (const marker of markers) {
        marker.setMap(null);
    }
}

function showVisibleMarkers(term: string) {
    //remove anything which doesn't match the string
    const regex = new RegExp(term);

    // const matchingVenues = this.allVenues.filter((v: Venue) => regex.test(v.name));
    const matchingMarkers = markers.filter((m: google.maps.Marker) => regex.test(m.getTitle()));

    hideAllMarkers();
    if (matchingMarkers.length !== 0) {
        const bounds = new google.maps.LatLngBounds();
        for (const marker of matchingMarkers) {
            marker.setMap(map);
            bounds.extend(marker.getPosition());
        }
        if (map) {

            map.fitBounds(bounds);
        }
    }
}


registerGoogleMaps(() => {
    map = initMap($('#map')[0]);

    fetch('data/wv.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            let venues = <Venue[]>myJson;
            const bounds = new google.maps.LatLngBounds();

            for (const v of venues) {
                vm.allVenues.push(v);

                const marker = new google.maps.Marker({
                    map: map,
                    position: v.location,
                    title: v.name,
                    animation: google.maps.Animation.DROP,
                });

                bounds.extend(v.location);

                const infowindow = new google.maps.InfoWindow({
                    content: `<div><a href="${v.href}">${v.name}</a></div>
                              <div>${v.phone}</div>`
                });

                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });

                markers.push(marker);
            }
            map.fitBounds(bounds);

            //triggger an update of the computed observables now we have loaded the venues
            vm.searchTerm.valueHasMutated();
            //add the hooks to update the map - these are not managed by Knockout
            vm.currentVenue.subscribe((venue) => showCurrentMarker(venue));
            vm.searchTerm.subscribe((term) => showVisibleMarkers(term));
            applyBindings(vm);
        });
});


const $search = $(`<input class="search" data-bind="textInput: searchTerm"></input>`)
const $view = $(`<ul data-bind="foreach: visibleVenues"><li data-bind="text:name, click:$root.setCurrentVenue"></li></ul>`);
$('#list').append($search).append($view);