import { } from 'googlemaps';
import * as style from './styles.css';
import * as $ from 'jquery';
import { registerGoogleMaps } from './gmap';
import { initMap } from './map';
import './components/venue-list/venueViewModel';
import { applyBindings, observableArray, components } from 'knockout';
import { Markers } from './markers'
import {Venue} from './Venue';

let t = style.test;
let map: google.maps.Map;
let venues: Venue[];

// const vm = new ViewModel({venues : []});
let markers: Markers;

class AllViewModel {
    venues : KnockoutObservable<Venue[]>;
    visibleVenues : KnockoutObservable<Venue[]>;
    constructor(){
        this.venues = observableArray();
        this.visibleVenues = observableArray();
    }
}

let allViewModel : AllViewModel;

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
        allViewModel = new AllViewModel();

        for (const v of venues) {
            allViewModel.venues.push(v);

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
        // vm.searchTerm.valueHasMutated();
        //add the hooks to update the map - these are not managed by Knockout
        // vm.currentVenue.subscribe((venue) => markers.showCurrentMarker(venue));
        // vm.searchTerm.subscribe((term) => markers.showVisibleMarkers(term));
        applyBindings(allViewModel);
    });
});
