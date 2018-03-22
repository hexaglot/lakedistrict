import { } from 'googlemaps';
import * as style from './styles.css';
import * as $ from 'jquery';
import { registerGoogleMaps } from './gmap';
import { initMap } from './map';
import { Venue, ViewModel } from './venueViewModel';
import { applyBindings } from 'knockout';
import { Markers } from './markers'

let t = style.test;
let map: google.maps.Map;
let venues: Venue[];

const vm = new ViewModel()
let markers: Markers;


//load venue data
function loadVenueData() {
    return fetch('data/wv.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            return new Promise((resolve: any) => { resolve(<Venue[]>json) });
        });
}

const loadVenues = loadVenueData();
const loadGoogleMaps = registerGoogleMaps();

const createMap = loadGoogleMaps.then(() => {
    return new Promise((resolve, reject) => {
                        resolve(initMap($('#map')[0]))
    })});

createMap.then((map : google.maps.Map) => {
    markers = new Markers(map);

    loadVenues.then((venues: Venue[]) => {
        const bounds = new google.maps.LatLngBounds();
        for (const v of venues) {
            vm.allVenues.push(v);

            const marker = new google.maps.Marker({
                map: map,
                position: v.location,
                title: v.name,
                animation: google.maps.Animation.DROP,
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });

            markers.addMarker(marker);

            const infowindow = new google.maps.InfoWindow({
                content: `<div><a href="${v.href}">${v.name}</a></div>
                              <div>${v.phone}</div>`
            });

            bounds.extend(v.location);
        }
        map.fitBounds(bounds);

        //triggger an update of the computed observables now we have loaded the venues
        vm.searchTerm.valueHasMutated();
        //add the hooks to update the map - these are not managed by Knockout
        vm.currentVenue.subscribe((venue) => markers.showCurrentMarker(venue));
        vm.searchTerm.subscribe((term) => markers.showVisibleMarkers(term));
        applyBindings(vm);
    });
});


const $search = $(`<input class="search" data-bind="textInput: searchTerm"></input>`)
const $view = $(`<ul data-bind="foreach: visibleVenues"><li data-bind="text:name, click:$root.setCurrentVenue"></li></ul>`);
$('#list').append($search).append($view);