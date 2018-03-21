import { observable, computed, applyBindings, observableArray } from 'knockout';
import { } from 'googlemaps';
import * as style from './styles.css';
import * as $ from 'jquery';
import { registerGoogleMaps } from './gmap';

// let venues: Venue[];
let markers: google.maps.Marker[] = [];
let t = style.test;
let map: google.maps.Map;

interface Venue {
    name: string,
    phone: string,
    href: string,
    latlng: google.maps.LatLng,
    location: google.maps.LatLng,
    place_id: string,
    address: string
}

class ViewModel {
    // visibleVenues: KnockoutObservableArray<Venue>;
    allVenues: Venue[];
    searchTerm: KnockoutObservable<string>;
    computedVisible: KnockoutComputed<Venue[]>;

    constructor() {
        // this.visibleVenues = observableArray();
        this.allVenues = [];
        this.searchTerm = observable('');
        this.computedVisible = computed((): Venue[] => {
            const regex = new RegExp(this.searchTerm());
            const matchingVenues = this.allVenues.filter((v: Venue) => regex.test(v.name));
            this.showVisibleMarkers();
            return matchingVenues;
        }, this);
    };

    showMarker(item: Venue) {
        //hide all markers
        for (const marker of markers) {
            marker.setMap(null);

            if (marker.getTitle() === item.name) {
                marker.setMap(map);
                map.setCenter(marker.getPosition());
            }
        }
    }

    hideAllMarkers() {
        for (const marker of markers) {
            marker.setMap(null);
        }
    }

    showVisibleMarkers() {
        //remove anything which doesn't match the string
        const regex = new RegExp(this.searchTerm());

        // const matchingVenues = this.allVenues.filter((v: Venue) => regex.test(v.name));
        const matchingMarkers = markers.filter((m: google.maps.Marker) => regex.test(m.getTitle()));

        this.hideAllMarkers();
        if (matchingMarkers.length !== 0) {
            const bounds = new google.maps.LatLngBounds();
            for (const marker of matchingMarkers) {
                marker.setMap(map);
                bounds.extend(marker.getPosition());
            }
            map.fitBounds(bounds);
        }
    }
}

const vm = new ViewModel()


registerGoogleMaps(() => {
    map = new google.maps.Map(document.getElementById("map"), {
        // center: {
        //     "lat": 54.4085885,
        //     "lng": -2.9313721
        // },
        zoom: 15
    });

    map.data.loadGeoJson('data/lakes.geojson');
    map.data.setStyle({
        fillColor: 'green'
    });

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
            applyBindings(vm);
        });
});


const $search = $(`<input class="search" data-bind="textInput: searchTerm"></input>`)
let $view = $(`<ul data-bind="foreach: computedVisible"><li data-bind="text:name, click:$root.showMarker"></li></ul>`);
$('#list').append($search).append($view);

// $search.on('keyup', (event) => vm.filterList(<string>$('.search').val()));






